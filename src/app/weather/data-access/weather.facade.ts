import {computed, inject, Injectable, signal} from '@angular/core';
import {WeatherService} from "./weather.service";
import {catchError, filter, map, Observable, share, Subject, switchMap} from "rxjs";
import {connect} from "ngxtension/connect";
import {injectQueryParams} from "ngxtension/inject-query-params";
import {Weather, WeatherForecast, WeatherState} from "./weather.model";
import {ToastService} from "../../shared/ui/toast/toast.model";
import {CitySearchService} from "../../location/data-access/city-search.service";
import {toObservable} from "@angular/core/rxjs-interop";

@Injectable()
export class WeatherFacade {
  private weatherService: WeatherService = inject(WeatherService);
  private citySearchStateService: CitySearchService = inject(CitySearchService);
  private query = injectQueryParams('city');
  private toastService = inject(ToastService);

  //state
  private state = signal<WeatherState>({
    weather: undefined,
    forecast: undefined
  });

  // selectors
  weather = computed(() => this.state().weather);
  forecast = computed(() => this.state().forecast);

  //sources
  search$ = new Subject<string>();

  constructor() {
    const city$ = this.citySearchStateService.city;
    const nextWeather$ = toObservable(city$).pipe(
      filter(Boolean),
      switchMap(city => this.getWeather(city).pipe(
        filter(Boolean)
      )),
      share()
    );

    const nextForecast$ = nextWeather$.pipe(
      switchMap(weather => this.getWeatherForecast(weather.coord.lat, weather.coord.lon)),
      filter(Boolean),
    );

    connect<WeatherState>(this.state)
      .with(nextWeather$, (state, weather) => ({
        ...state,
        weather
      }))
      .with(nextForecast$, (state, forecast) => ({
        ...state,
        forecast
      }));
  }

  private getWeather(city: string): Observable<Weather | undefined> {
    return this.weatherService.getWeather(city).pipe(
      catchError((error: Error) => {
          return this.toastService.showError$(error.message).pipe(map(() => undefined)
          )
        }
      )
    );
  }

  private getWeatherForecast(lat: number, lon: number): Observable<WeatherForecast> {
    return this.weatherService.getWeatherForecast(lat, lon).pipe(
      catchError((error: Error) =>
        this.toastService.showError$(error.message).pipe(map(() => ({list: []}))
        )
      )
    );
  }
}
