import {computed, inject, Injectable, signal} from '@angular/core';
import {WeatherService} from "../data-access/weather.service";
import {WeatherState} from "./weather.model";
import {catchError, concat, filter, first, map, Observable, of, share, Subject, switchMap} from "rxjs";
import {connect} from "ngxtension/connect";
import {injectQueryParams} from "ngxtension/inject-query-params";
import {Weather} from "../data-access/weather.model";
import {ToastService} from "../../toast/toast.model";
import {CityService} from "../../location/city.service";
import {toObservable} from "@angular/core/rxjs-interop";

@Injectable()
export class WeatherFacade {
  private weatherService: WeatherService = inject(WeatherService);
  private cityService: CityService = inject(CityService);
  private query = injectQueryParams('city');
  private toastService = inject(ToastService);

  //state
  private state = signal<WeatherState>({
    weather: undefined,
    city: ''
  });

  // selectors
  weather = computed(() => this.state().weather);
  city = computed(() => this.state().city);

  //sources
  search$ = new Subject<string>();

  constructor() {
    const initCity$ = toObservable(this.query).pipe(
      switchMap((value) => {
        if (!value) {
          return this.cityService.getCity();
        }
        return of(value);
      }),
      first()
    );
    const city$ = concat(initCity$, this.search$).pipe(share());
    const nextWeather$ = city$.pipe(
        filter(Boolean),
        switchMap(city => this.getWeather(city).pipe(
          filter(Boolean)
        ))
      );

    connect(this.state)
      .with(nextWeather$, (state, weather) => ({
        ...state,
        weather
      }))
      .with(
        city$,
        (state, city) => ({
          ...state,
          city
        })
      );
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
}
