import AuthService from '@src/services/auth';
import mongoose, { Document, Model } from 'mongoose';
export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED',
}

interface UserModel extends Omit<User, '_id'>, Document {}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique'],
    },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

//a validação feita abaixo é para verificar se um email já existe dentro da base de dados através do validate do mongoose, basicamente nós buscamos caso o email que esteja sendo cadastrado já exista na base de dados, caso exista ele irá nos retornar um erro. Também caso o email seja duplicado, irá ser lançado um erro com algumas propriedades e entre ela, será passado a propriedade kind, que receberá o CUSTOM_VALIDATION que passadmos abaixo, assi conseguimos verificar se o erro foi específico de validação de email duplicado
schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database',
  CUSTOM_VALIDATION.DUPLICATED
);

schema.pre<UserModel>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return;
  }

  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (error) {
    console.error(`error hashing the password for the user ${this.name}`);
  }
});

export const User: Model<UserModel> = mongoose.model('User', schema);
