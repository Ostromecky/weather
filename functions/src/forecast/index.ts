import {CallableRequest, onCall} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import {ForecastParams, WeatherForecast} from './typings';
import {ForecastService} from './forecast.service';

export const getForecast = onCall({
  cors: true,
  secrets: ['APP_ID'],
  region: 'europe-central2',
}, async ({
  data
}: CallableRequest<ForecastParams>): Promise<WeatherForecast | void> => {
  logger.info('[GET FORECAST DATA]');
  return await new ForecastService().getForecast(data);
});



