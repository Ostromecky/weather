import {CallableRequest, onCall} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import {Weather, WeatherParams} from './typings';
import {toUrl} from '../shared/utils';
import {HttpsCallableResult} from 'firebase/functions';
import {NotFoundError} from '../shared/error';

export const getWeather = onCall({
  cors: true,
  secrets: ['APP_ID'],
  region: 'europe-central2',
}, async ({data: {q, units}}: CallableRequest<WeatherParams>): Promise<HttpsCallableResult<Weather>> => {
  logger.info('[GET WEATHER DATA]');
  const apiKey = process.env['APP_ID'] as string;
  const url = toUrl<WeatherParams & { appid: string }>('https://api.openweathermap.org/data/2.5/weather', {
    appid: apiKey,
    units,
    q,
  });
  return await fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  })
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
