export type Weather = {
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

export abstract class WeatherMainBase {
  humidity: number | undefined;
  pressure: number | undefined;
  temp: number | undefined;

  constructor(protected _weatherMain?: WeatherMainBase) {
    if (_weatherMain) {
      this.humidity = _weatherMain.humidity;
      this.pressure = _weatherMain.pressure;
      this.temp = _weatherMain.temp;
    }
  }
}

export interface WeatherMainServer extends WeatherMainBase {
  temp_min: number;
  temp_max: number;
}

export const isServerMain = (main: WeatherMainBase | WeatherMainServer): main is WeatherMainServer => {
  return (main as WeatherMainServer).temp_min !== undefined;
}

export const isClientMain = (main: WeatherMainBase | WeatherMain): main is WeatherMain => {
  return (main as WeatherMain).tempMin !== undefined;
}

export class WeatherMain extends WeatherMainBase {
  tempMin!: number;
  tempMax!: number;

  constructor(protected _weatherMain?: WeatherMainBase) {
    super(_weatherMain);
    if(_weatherMain) {
      if (isServerMain(_weatherMain)) {
        this.tempMin = _weatherMain.temp_min;
        this.tempMax = _weatherMain.temp_max;
      }
      if (isClientMain(_weatherMain)) {
        this.tempMin = _weatherMain.tempMin;
        this.tempMax = _weatherMain.tempMax;
      }
    }
  }
}

export type WeatherInfo = {
  description: string;
  main: string;
  icon: string;
}

export type WeatherParams = {
  q: string;
  units: 'metric' | 'imperial' | 'standard';
}
