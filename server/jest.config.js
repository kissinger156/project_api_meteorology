//esse é o arquivo de configuração global do jest
const { resolve } = require("path");

//definimos o diretório root usando o path
const root = resolve(__dirname);

module.exports = {
  rootDir: root,
  displayName: "root-tests", //definindo um nome para o teste para que seja mais fácil de identificar
  testMatch: ["<rootDir>/src/**/*.test.ts"], //esse arquivo de config só irá ser atribuido aos arquivos que estão dentro da parta src/
  testEnvironment: "node",
  clearMocks: true,
  preset: "ts-jest",
  moduleNameMapper: { //novamente abaixo temos que fazer a configuração do alias, como fizemos no src/utils/index.ts
    "@src/(.*)": "<rootDir>/src/$1",
    "@test/(.*)": "<rootDir>/test/$1",
  },
};
