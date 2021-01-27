import { StormGlass } from '@src/clients/stormGlass';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass_weather_normalized_response_3_hours.json';
import { Forecast, Beach, BeachPosition, ForecastProcessingInternalError } from '../forecast';
import * as HTTPUtil from '@src/utils/request';

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
  const MockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;

  //teste para verificar a igualdade entre lista de ojbjetos
  it('should return the forecast for a list of beaches', async () => {
    MockedStormGlassService.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponseFixture
    );

    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id',
      },
    ];

    const expectedResponse = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 3.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 0.47,
            windDirection: 299.45,
            windSpeed: 100,
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
            rating: 1,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T01:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100,
          },
        ],
      },
      {
        time: '2020-04-26T02:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 182.56,
            swellHeight: 0.28,
            swellPeriod: 3.44,
            time: '2020-04-26T02:00:00+00:00',
            waveDirection: 232.86,
            waveHeight: 0.46,
            windDirection: 321.5,
            windSpeed: 100,
          },
        ],
      },
    ];

    const forecast = new Forecast(MockedStormGlassService);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });

  //teste que retornar uma lista vazia caso a lista de praias também seja vazia
  it('should return an empty list when the beaches array is empty', async () => {
    const forecast = new Forecast();
    const response = await forecast.processForecastForBeaches([]);
    expect(response).toEqual([]);
  });

  //teste que retorna um erro caso dê algum erro durante o processo de captura de dados da api externa
  it('shoud throw internal processing error when something goes wrong during the rating process', async () => {
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id',
      },
    ];

    MockedStormGlassService.fetchPoints.mockRejectedValue('Error fething data');

    const forecast = new Forecast(MockedStormGlassService);
    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(ForecastProcessingInternalError)
  });
});
