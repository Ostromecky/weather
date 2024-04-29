import {Weather} from "../data-access/weather.model";

export type WeatherState = {
  weather: Weather | undefined;
  city: string;
};
