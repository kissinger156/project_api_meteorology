//classe criada para armazenamento de error internos da aplicação, ela possuirá uma estrutura que irá ajudar a distinguir se esse erro é interno da aplicação ou externo. Criamos no construtor basicamente, a mensagem do erro :string, code: number = 500(internal error) e a description que é opcional:string
export class InternalError extends Error {
  constructor(
    public message: string,
    protected code: number = 500,
    protected description?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
