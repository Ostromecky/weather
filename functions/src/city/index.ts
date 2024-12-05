import {CallableRequest, onCall} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import {toUrl} from '../shared/utils';
import {NotFoundError} from '../shared/error';
import {City, CityRequest} from './typings';

export const getCity = onCall({
  cors: true,
  secrets: ['GOOGLE_API_KEY'],
  region: 'europe-central2',
}, async ({data: {location, name}}: CallableRequest<CityRequest>): Promise<City | void> => {
  const apiKey = process.env['GOOGLE_API_KEY'] as string;
  const url = name ? toUrl<{
    key: string,
    address: string
  }>('https://maps.googleapis.com/maps/api/geocode/json', {
    key: apiKey,
    address: name
  }) : toUrl<{
    key: string,
    latlng: number[]
  }>('https://maps.googleapis.com/maps/api/geocode/json', {
    key: apiKey,
    latlng: [location?.latitude ?? 0, location?.longitude ?? 0],
  });
  logger.info('[GET CITY]: ', url);
  return await fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  })
    .then((response) => {
      logger.info('[SUCCESS]: ', response, {structuredData: true});
      return toCity(response);
    })
    .catch((response: Response) => {
      logger.error('[ERROR]: ', response, {structuredData: true});
      if (response.status === 404) {
        throw new NotFoundError('City not found');
      }
    });
});


const toCity = (response: any): City => {
  return {
    name: response.results[0].address_components.find((component: any) => component.types.includes('locality')).long_name,
    location: {
      latitude: response.results[0].geometry.location.lat,
      longitude: response.results[0].geometry.location.lng
    }
  }
}
