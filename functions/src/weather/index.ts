import {CallableRequest, onCall} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import {Weather, WeatherParams} from './typings';
import {toUrl} from '../shared/utils';
import {NotFoundError} from '../shared/error';
import {fetcher} from '../shared/fetcher';

export const getWeather = onCall({
  cors: true,
  secrets: ['APP_ID'],
  region: 'europe-central2',
}, async ({data: {q, units}}: CallableRequest<WeatherParams>): Promise<Weather | void> => {
  logger.info('[GET WEATHER DATA]');
  const apiKey = process.env['APP_ID'] as string;
  const url = toUrl<WeatherParams & { appid: string }>('https://api.openweathermap.org/data/2.5/weather', {
    appid: apiKey,
    units,
    q,
  });
  return await fetcher<Weather>(url)
    .then((response) => {
      logger.info('[SUCCESS]: ', response, {structuredData: true});
      return response;
    })
    .catch((response: Response) => {
      logger.error('[ERROR]: ', response, {structuredData: true});
      if (response.status === 404) {
        throw new NotFoundError(`Could not find weather data for city ${q}`);
      }
    });
});
