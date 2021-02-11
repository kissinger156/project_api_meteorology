import * as http from 'http';
import { DecodedUser } from './services/auth';

//criamos um types para adicionar uma proriedade para o nosso Request do express, o decoded é onde será armazenado os dados do usuario, e como por padrão o req.decoded não existe, tivemos que fazer dessa forma
declare module 'express-serve-static-core' {
  export interface Request extends http.IncomingMessage, Express.Request {
    decoded?: DecodedUser;
  }
}
