import {WeatherForecast, WeatherForecastItem, WeatherForecastItemServer} from './typings';
import {WeatherInfo, WeatherMain} from '../weather/typings';

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
        dt: item.dt,
        main,
        weather: weatherInfo
      } satisfies WeatherForecastItem;
    }) ?? []
  }
}
