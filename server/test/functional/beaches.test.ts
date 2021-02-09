import { Beach } from '@src/models/beach';
import { SetupServer } from '@src/server';

describe('Beaches functional tests', () => {
  //basicamente antes do teste iniciar será feito uma limpeza na base de dados excluindo todas praias existentes, garantindo que o teste inicie limpo
  beforeAll(async () => await Beach.deleteMany({}));

  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toBe(201);

      //nesse caso fizemos uma verificação dentro do toEqual, para que mesmo se for adicionado outros campos no retorno de quando for criado por exemplo o Id, o teste continue funcionando, o expect.objectContaining é para ver se o objeto passado está contido no response, se tiver, está ok
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('should return 422 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid_string" at path "lat"',
      });
    });

    it.skip('should return 500 when there is a internal error', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const beach = new SetupServer();

      await beach.close();

      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: 500,
        error: 'Internal Server Error',
      });
    });
  });
});
