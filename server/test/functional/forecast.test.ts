//o describe define um bloco de códigos, dentro dele pode ter diversos testes
describe('Beach forecast functional tests', () => {
  //cada testes é definido pelo it()
  it('should return a forecast with just a few times', async () => {
    //no caso desse teste, nós vamos usar o supertest para buscar um retorno em uma rota e vamos comparar os return dessa rota, como baixo podemos ver, pegar o body e o status de uma requisição get e depois comparamos com o toBe, ou seja, esperamos que o status seja (200) e o corpo da req seja aquel.
    const { body, status } = await global.testRequest.get('/forecast');
    expect(status).toBe(200);
    expect(body).toEqual([
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 2,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 3.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 0.47,
            windDirection: 299.45,
          },
        ],
      },
      {
        time: '2020-04-26T01:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 2,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T01:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
          },
        ],
      },
    ]);
  });
});
