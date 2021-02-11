//sempre que for necessário adicionar um novo type a uma lib, a sua tipagem caso necessite de import, ela precisa ser definida da forma que foi feita nesse arquivo para que ela o arquivo seja interpretado sem problemas.
declare namespace NodeJS {
  interface Global {
    testRequest: import('supertest').SuperTest<import('supertest').Test>;
  }
}
