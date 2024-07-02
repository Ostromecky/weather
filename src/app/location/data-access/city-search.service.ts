import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {CityService} from "./city.service";
import {injectQueryParams} from "ngxtension/inject-query-params";
import {toObservable} from "@angular/core/rxjs-interop";
import {concat, first, share, Subject, switchMap, takeUntil} from "rxjs";
import {connect} from "ngxtension/connect";
import {CityState} from "./city.model";

@Injectable({providedIn: 'root'})
export class CitySearchService {
  private query: Signal<string | null> = injectQueryParams('cities[query]');
  private cityService: CityService = inject(CityService);

  //state
  private state = signal<CityState | undefined>(undefined);

  //sources
  search$ = new Subject<string>();

  // selectors
  city = computed(() => this.state());

  constructor() {
    const initCity$ = toObservable(this.query).pipe(
      switchMap((value) =>
        this.cityService.initCity(value ? value : undefined)
      ),
      first()
    );
    const city$ = concat(initCity$.pipe(
      takeUntil(this.search$)
    ), this.searchByName()).pipe(share());

    connect<CityState | undefined>(this.state).with(
      city$,
      (state, city) => ({
        ...state,
        ...city
      })
    )
  }

  private searchByName() {
    return this.search$.pipe(
      switchMap((cityName) => this.cityService.getCityByName(cityName))
    );
  }
}
