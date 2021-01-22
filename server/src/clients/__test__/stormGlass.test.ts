import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassWeatherNormalized3HoursFixture from '@test/fixtures/stormglass_weather_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  //criando um mock do axios junto com o jest, ou seja, o mocar algo é criar uma simulação de algo, nesse caso do axios junto com o jest, então quando a gente precisar chamar essa const mockedAxios, vamos poder utilizar tanto as propriedades do axios quando também a do jest
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  it('Should return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassWeatherNormalized3HoursFixture);
  });

  it('should exclude incomplete data points', async () => {
    //esse teste basicamente irá verificar o que acontece caso seja passado uma response incompleta, como no nosso client a gente fez um isValidPoint para verificar se todos os campos estão preenchidos, caso não esteja ele exclui aquele ponto do array, e no final a gente faz a verificação passando uma response incompleto e pela lógica ele retorna um array vazio pois o mesmo será excluido. então toEqual([])
    const lat = -33.792726;
    const lng = 151.289824;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };
    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  //teste para mostrar um erro generico quando a requisição falha, antes de chegar ao serviço do stom glass
  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedAxios.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedAxios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  //teste para verificar o retorno de erro da API do storm glass quando der o limite máximos de requisições diárias.
  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedAxios.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });

    const stormGlass = new StormGlass(mockedAxios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass Service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
