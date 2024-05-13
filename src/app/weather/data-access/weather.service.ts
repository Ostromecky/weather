import {inject, Injectable} from '@angular/core';
import {catchError, from, map, Observable, throwError} from "rxjs";
import {Weather, WeatherParams} from "./weather.model";
import {Functions, httpsCallable} from "@angular/fire/functions";

@Injectable({providedIn: 'root'})
export class WeatherService {
  private functions: Functions = inject(Functions);

  getWeather(city: string): Observable<Weather> {
    // const params = new HttpParamsBuilder<WeatherParams>().set('units', 'metric').set('q', city).build();
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
}
