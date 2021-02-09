import { CUSTOM_VALIDATION } from '@src/models/user';
import { Response } from 'express';
import mongoose from 'mongoose';

//classe foi criada apenas para servir como uma base para error genéricos, já que geralmente nossos controllers usarão as mesmas validações como padrão em funções de create e update, para ser usado essa classe, basta usar o extends BaseController, e buscar ela pelo this.sendCreate... e passar os parâmetros necessários.
export abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(
    res: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    //basicamente no if estamos verificando se primeiro foi um erro de validação do mongoose, caso seja, retornamos um erro 422 para o usuário, legal essa forma de verificar em específico se foi um erro de validação do próprio mongoose, caso não seja, retornamos um erro 500
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      res
        .status(clientErrors.code)
        .send({ code: clientErrors.code, error: clientErrors.error });
    } else {
      res.status(500).send({ code: 500, error: 'Something went wrong!' });
    }
  }

  private handleClientErrors(
    error: mongoose.Error.ValidationError
  ): { code: number; error: string } {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
    );
    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    }
    return { code: 422, error: error.message };
  }
}
