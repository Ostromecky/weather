import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {WeatherService} from "../data-access/weather.service";
import {WeatherState} from "./weather.model";
import {catchError, concat, defer, filter, first, map, Observable, of, Subject, switchMap} from "rxjs";
import {connect} from "ngxtension/connect";
import {injectQueryParams} from "ngxtension/inject-query-params";
import {Weather} from "../data-access/weather.model";
import {ToastService} from "../../toast/toast.model";
import {CityService} from "../../location/city.service";

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
    const initCity$ = defer(() => this.search$).pipe(
      switchMap((value) => {
        if (!value) {
          return this.cityService.getCity().pipe(first());
        }
        return of(value);
      }),
    );
    const city$ = concat(initCity$, this.search$);
    const nextWeather$ = city$.pipe(
        filter(Boolean),
        switchMap(city => this.getWeather(city).pipe(
          filter(Boolean)
        ))
      )
    ;

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

    effect(() => {
      this.search$.next(this.query() ?? '');
    }, {allowSignalWrites: true});
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
