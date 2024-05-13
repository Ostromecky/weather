export interface Weather {
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
}

interface WeatherInfo {
  main: string;
  icon: string;
}
export type WeatherParams = {
  q: string;
  units: 'metric' | 'imperial' | 'standard';
}
