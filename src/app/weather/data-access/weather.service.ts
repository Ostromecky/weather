import {inject, Injectable} from '@angular/core';
import {catchError, from, map, Observable, throwError} from "rxjs";
import {ForecastParams, Weather, WeatherForecast, WeatherParams} from "./weather.model";
import {Functions, httpsCallable} from "@angular/fire/functions";

@Injectable({providedIn: 'root'})
export class WeatherService {
  private functions: Functions = inject(Functions);

  constructor() {
    this.functions.region = 'europe-central2';
  }

  getWeather(city: string): Observable<Weather> {
    const callable = from(httpsCallable<WeatherParams, Weather>(this.functions, 'getWeather')({
      units: 'metric',
      q: city
    }));
    return callable.pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error(error.message);
        return throwError(() => new Error(error.message));
      })
    );
  }

  getWeatherForecast(lat: number, lon: number): Observable<WeatherForecast> {
    const callable = from(httpsCallable<ForecastParams, WeatherForecast>(this.functions, 'getForecast')({
      units: 'metric',
      lat,
      lon
    }));

    return callable.pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error(error.message);
        return throwError(() => new Error(error.message));
      })
    );
  }
}
