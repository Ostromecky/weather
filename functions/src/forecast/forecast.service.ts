import {ForecastParams, WeatherForecast, WeatherForecastItem, WeatherForecastItemServer} from './typings';
import {forecastAdapter} from './forecast-adapter';
import {toUrl} from '../shared/utils';
import {fetcher} from '../shared/fetcher';
import {NotFoundError} from '../shared/error';
import {logger} from 'firebase-functions';
import {eachDayOfInterval, fromUnixTime, isSameDay} from 'date-fns';
import {instanceToPlain} from 'class-transformer';

export class ForecastService {
  private uri = 'https://api.openweathermap.org/data/2.5/forecast';
  private appid = process.env['APP_ID'] as string;

  async getForecast({units, lat, lon}: ForecastParams): Promise<WeatherForecast | void> {
    const url = toUrl<ForecastParams & { appid: string }>(this.uri, {
      appid: this.appid,
      units,
      lat,
      lon,
    });
    return await fetcher<WeatherForecast<WeatherForecastItemServer>>(url)
      .then((response) => {
        logger.info('[SUCCESS]: ', response, {structuredData: true});
        const forecast = instanceToPlain(forecastAdapter(response), {excludePrefixes: ['_']});
        return {
          ...forecast,
          list: this.getMinMaxForecastList(forecast.list)
        }
      }).catch((response: Response) => {
        logger.error('[ERROR]: ', response, {structuredData: true});
        if (response.status === 404) {
          throw new NotFoundError('Could not find weather forecast');
        }
      });
  }

  private getMinMaxForecastList(list: WeatherForecastItem[]): WeatherForecastItem[] {
    const days: Date[] = eachDayOfInterval({
      start: fromUnixTime(list[0].dt),
      end: fromUnixTime(list[list.length - 1].dt)
    });

    return days.map(day => {
      return list.filter((item) => {
        const date = fromUnixTime(item.dt);
        return isSameDay(day, date);
      }).reduce((acc, item) => {
        return {
          ...acc,
          main: {
            ...acc.main,
            tempMin: Math.min(acc.main.tempMin, item.main.tempMin),
            tempMax: Math.max(acc.main.tempMax, item.main.tempMax)
          }
        } satisfies WeatherForecastItem
      })
    })
  }
}
