import { InternalError } from '@src/utils/errors/internal.error';
import { AxiosStatic } from 'axios';

export interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  readonly time: string;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly waveHeight: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time: string;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  waveDirection: number;
  waveHeight: number;
  windDirection: number;
  windSpeed: number;
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error when trying to communicate to StormGlass';
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error returned by the StormGlass Service';
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    try {
      const response = await this.request.get<StormGlassForecastResponse>(
        `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${lng}`,
        {
          headers: {
            Authorization: 'example-api-key',
          },
        }
      );

      return this.normalizeResponse(response.data);
    } catch (err) {
      if (err.response && err.response.status) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`
        );
      }
      throw new ClientRequestError(err.message);
    }
  }

  //essa classe irá normalizar nossa response da api, ou seja, primeiramente ele nos retorna um response no formato do StormGlassForecastResponse, após isso a gente já faz a tipagem dessa lista com a nova forma que a gente deseja receber, que no caso é a ForecastPoint[] colchetes no final para sinalizar que é uma lista
  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    //agora nós pegamos em específicamente nossa lista, que está dentro de hours, e filtramos ela, primeiramente, a gente verifica com a função criada abaixo se todos os campos estão válidos e preenchidos, usando o bind(this) que vai meio que pegar o item atual que está sendo filtrado, depois vamos mapear esse array, e dentro dele nós vamos passar o novo formato que desejamos, que é o ForecastPointer, ou seja, vamos ter todos os valores já contidos na raiz, então, primeiramente passamos o nome que desejamos e após isso o valor, que no caso é o point...[this.stormGlassAPISource(noaa)], com isso normalizamos o response da api
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource],
    }));
  }

  //a tipagem usando Partial define que as propriedades serão opcionais.
  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    //o return abaixo foi usado !! na frente para que force a ser reconhecido como boolean, dentro do return, temos todos os pointers sendo verificados, o ?. é basicamente se o item existir, verifique também se o item que está dentro dele também existe.
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}
