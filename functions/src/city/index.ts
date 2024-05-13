import {CallableRequest, onCall} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import {toUrl} from '../shared/utils';
import {HttpsCallableResult} from 'firebase/functions';
import {NotFoundError} from '../shared/error';

export const getCity = onCall({
  cors: true,
  secrets: ['GOOGLE_API_KEY'],
}, async ({data: {latitude, longitude}}: CallableRequest<{
  latitude: number,
  longitude: number
}>): Promise<HttpsCallableResult<string>> => {
  logger.info('[GET CITY]');
  const apiKey = process.env['GOOGLE_API_KEY'] as string;
  const url = toUrl<{
    key: string,
    latlng: number[]
  }>('https://maps.googleapis.com/maps/api/geocode/json', {
    key: apiKey,
    latlng: [latitude, longitude],
  });
  return await fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  })
    .then((response) => {
      logger.info('[SUCCESS]: ', response, {structuredData: true});
      return response.results[0].address_components.find((component: any) => component.types.includes('locality')).long_name;
    })
    .catch((response: Response) => {
      logger.error('[ERROR]: ', response, {structuredData: true});
      if (response.status === 404) {
        throw new NotFoundError('City not found');
      }
    });
});
