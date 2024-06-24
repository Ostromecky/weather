import {CityState} from "../../location/data-access/city.model";

export interface Weather {
  coord: Coordinates;
  weather: WeatherInfo[];
  main: WeatherMain;
  wind: WeatherWind;
  sys: WeatherSys;
  name: string;
}

interface WeatherSys {
  country: string;
}

interface WeatherWind {
  speed: number;
}

interface WeatherMain {
  temp: number;
  humidity: number;
  pressure: number;
  tempMax: number;
  tempMin: number;
}

interface WeatherInfo {
  main: string;
  icon: string;
  description: string;
}

export type Coordinates = {
  lon: number;
  lat: number;
}

export type WeatherState = {
  weather: Weather | undefined;
  forecast: WeatherForecast | undefined;
};

export type WeatherParams = {
  //city name
  q: CityState['name'];
  units: 'metric' | 'imperial' | 'standard';
}

export type ForecastParams = {
  lat: number;
  lon: number;
  units: 'metric' | 'imperial' | 'standard';
}

export type WeatherForecastItem = {
  date: Date;
  main: WeatherMain;
  weather: WeatherInfo[];
}

export type WeatherForecast = {
  list: WeatherForecastItem[];
}
