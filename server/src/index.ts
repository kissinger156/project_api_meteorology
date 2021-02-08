import { SetupServer } from './server';
import config from 'config';

//nesse caso o index é o que vai dar start ao nosso server, a função abaixo é basicamente uma função que se chama sozinha, então segue essa sintaxe (async => {})(), e dentro dela passa o desejado
(async (): Promise<void> => {
  const server = new SetupServer(config.get('App.port'));
  await server.init();
  server.start();
})();
