import {WeatherForecast, WeatherForecastItem, WeatherForecastItemServer} from './typings';
import {WeatherInfo, WeatherMain} from '../weather/typings';
import {fromUnixTime} from 'date-fns';

export const forecastAdapter = ({list}: WeatherForecast<WeatherForecastItemServer>): WeatherForecast => {
  return {
    list: list?.map((item) => {
      const main = new WeatherMain(item.main);
      const weatherInfo = item.weather.map((info) => {
        return {
          description: info.description,
          icon: info.icon,
          main: info.main
        } satisfies WeatherInfo;
      });
      return {
        date: fromUnixTime(item.dt).toISOString(),
        main,
        weather: weatherInfo
      } satisfies WeatherForecastItem;
    }) ?? []
  }
}
