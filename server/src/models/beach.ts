import mongoose, { Model, Document } from 'mongoose';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  _id?: string;
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
}

const schema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
  },
  {
    toJSON: {
      //basicamente a função abaixo irá meio que formatar o response que será retornado ao usuário, a função não irá mexer na base de dados, apenas na respota para o user final. Basicamente estamos atribuindo a uma variavel id o valor do _id e após isso excluindo o _id e o __v do response, para termos um response mais limpo e normalizado
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

//interface irá permitir que nós tenhamos acesso as propriedades da interface Beach e além disso termos acesso as propriedades do mongoose, como find(), save(), etc, que o Document irá permitir.
interface BeachModel extends Omit<Beach, '_id'>, Document {}

export const Beach: Model<BeachModel> = mongoose.model('Beach', schema);
