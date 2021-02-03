import { Beach, BeachPosition } from '@src/models/beach';
import nock from 'nock';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import apiForecastResponse1Beach from '@test/fixtures/api_forecast_response_1_beach.json';
//o describe define um bloco de códigos, dentro dele pode ter diversos testes
describe('Beach forecast functional tests', () => {
  beforeEach(async () => {
    await Beach.deleteMany({});

    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
    };

    const beach = new Beach(defaultBeach);
    await beach.save();
  });
  //cada testes é definido pelo it()
  it('should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: { Authorization: (): boolean => true },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
      })
      .reply(200, stormGlassWeather3HoursFixture);

    //no caso desse teste, nós vamos usar o supertest para buscar um retorno em uma rota e vamos comparar os return dessa rota, como baixo podemos ver, pegar o body e o status de uma requisição get e depois comparamos com o toBe, ou seja, esperamos que o status seja (200) e o corpo da req seja aquel.
    const { body, status } = await global.testRequest.get('/forecast');
    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponse1Beach);
  });

  it('should return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: { Authorization: (): boolean => true },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v1/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
      })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest.get('/forecast');

    expect(status).toBe(500);
  });
});
