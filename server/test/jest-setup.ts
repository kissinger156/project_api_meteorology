//responsavel por inicializar o servidor para todos os testes funcionais

import { SetupServer } from '@src/server';
import supertest from 'supertest';

let server: SetupServer;

//função irá rodas antes de todos os testes da aplicação
beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp());
});

//após a execução dos testes, esse comando irá encerrar o banco de dados e também a aplicação
afterAll(async () => await server.close());
