import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Weather, WeatherParams} from "./weather.model";
import {HttpParamsBuilder} from "../utils/http-params";

@Injectable({providedIn: 'root'})
export class WeatherService {
  private http: HttpClient = inject(HttpClient);
  //TODO make an injector
  private apiKey = 'd0fb407404512935d745210663eafffd';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/';


  getWeather(city: string): Observable<Weather> {
    const params = new HttpParamsBuilder<WeatherParams>().set('units', 'metric').set('q', city).set('appid', this.apiKey).build();
    return this.http.get<Weather>(this.apiUrl + '/weather', {params}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error)
        return throwError(() => new Error(error.error.message));
      }))
  }
}
