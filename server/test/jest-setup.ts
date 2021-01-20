//responsavel por inicializar o servidor para todos os testes funcionais

import { SetupServer } from '@src/server';
import supertest from 'supertest';

//função irá rodas antes de todos os testes da aplicação
beforeAll(() => {
  const server = new SetupServer();
  server.init();
  global.testRequest = supertest(server.getApp());
});
