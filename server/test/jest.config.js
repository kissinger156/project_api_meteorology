const { resolve } = require('path');
const root = resolve(__dirname, '..');
const rootConfig = require(`${root}/jest.config.js`);

/* pegando as configurações do ..rootConfig que é o arquivo da pasta raiz e alterando sobrescrevendo algumas configurações dele */
module.exports = {...rootConfig, ...{
  rootDir: root,
  displayName: "end2end-tests", //name do test
  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"], //arquivo que vai rodar antes de realizar os testes
  testMatch: ["<rootDir>/test/**/*.test.ts"], //esse arquivo só será válido para os arquivos que estão dentro da pasta test
}}