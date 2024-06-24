import {WeatherInfo, WeatherMain, WeatherMainServer} from '../weather/typings';


export type ForecastParams = {
  lat: number;
  lon: number;
  units: 'metric' | 'imperial' | 'standard';
}

type WeatherForecastBase = {
  weather: WeatherInfo[];
}

export type WeatherForecastItemServer = WeatherForecastBase & {
  dt: number;
  main: WeatherMainServer;
}

export type WeatherForecastItem = WeatherForecastBase & {
  date: string;
  main: WeatherMain;
}

export type WeatherForecast<T extends WeatherForecastBase = WeatherForecastItem> = {
  list: T[];
}
