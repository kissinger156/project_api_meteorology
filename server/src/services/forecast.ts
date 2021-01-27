import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import { InternalError } from '@src/utils/errors/internal.error';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface TimeForescast {
  time: string;
  forecast: BeachForecast[];
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  //funcao ira listar uma promisse com o type TimeForecast, ira receber primeiro uma praia, com suas proriedades e depois de listar os dados da api, ser feito um map no point (variavel que recebeu os dados externos) e dentro dele ser adicionado os dados da praia, para ficar no type BeachForecast
  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForescast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

        const enrichedBeachData = this.enrichedBeachData(points, beach);

        pointsWithCorrectSources.push(...enrichedBeachData);
      }
      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (error) {
      throw new ForecastProcessingInternalError(error.message);
    }
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: Beach
  ): BeachForecast[] {
    return points.map((e) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...e,
    }));
  }

  //funcao para organizar a listagem por forecaast inside of time basicamente esse função está sendo chamada no metodo que busca os dados na api externa, criamos uma lista vazia primeiramente e depois um for nos dados que ira ser passado para a funcao, o for ir verificar basicamente se o time dos dados passados existe e é igual ao da lista vazia que criamos, caso seja, vamos apenas dar um timePoint.forecast.push(point) ou seja, vamos apenas adicionar o point dentro do objeto forecast, caso não seja nós vamos normalizar os dados, organizando em time e forecast.
  private mapForecastByTime(forecast: BeachForecast[]): TimeForescast[] {
    const forecastByTime: TimeForescast[] = [];
    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }

    return forecastByTime;
  }
}
