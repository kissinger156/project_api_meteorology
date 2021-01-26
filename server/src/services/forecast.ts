import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';

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

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForescast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    for (const beache of beaches) {
      const points = await this.stormGlass.fetchPoints(beache.lat, beache.lng);
      const enrichedBeachData = points.map((e) => ({
        ...{
          lat: beache.lat,
          lng: beache.lng,
          name: beache.name,
          position: beache.position,
          rating: 1,
        },
        ...e,
      }));
      pointsWithCorrectSources.push(...enrichedBeachData);
    }

    return this.mapForecastByTime(pointsWithCorrectSources);
  }

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
