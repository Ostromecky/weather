import {WeatherInfo, WeatherMain, WeatherMainServer} from '../weather/typings';


export type ForecastParams = {
  lat: number;
  lon: number;
  units: 'metric' | 'imperial' | 'standard';
}

type WeatherForecastBase = {
  dt: number;
  weather: WeatherInfo[];
}

export type WeatherForecastItemServer = WeatherForecastBase & {
  main: WeatherMainServer;
}

export type WeatherForecastItem = WeatherForecastBase & {
  main: WeatherMain;
}

export type WeatherForecast<T extends WeatherForecastBase = WeatherForecastItem> = {
  list: T[];
}
