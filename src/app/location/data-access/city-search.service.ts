import {computed, inject, Injectable, signal} from '@angular/core';
import {CityService} from "./city.service";
import {injectQueryParams} from "ngxtension/inject-query-params";
import {toObservable} from "@angular/core/rxjs-interop";
import {concat, first, map, of, share, Subject, switchMap} from "rxjs";
import {connect} from "ngxtension/connect";
import {City, CityState} from "./city.model";
import {FireStoreService} from "../../shared/data-access/fire-store.service";

@Injectable({providedIn: 'root'})
export class CitySearchService {
  private query = injectQueryParams('city');
  private cityService: CityService = inject(CityService);
  private fireStoreService: FireStoreService<City> = inject(FireStoreService);

  //state
  private state = signal<CityState>({
    name: '',
    location: {
      latitude: 0,
      longitude: 0
    },
    id: ''
  });

  //sources
  search$ = new Subject<string>();

  // selectors
  city = computed(() => this.state().name);

  constructor() {
    const initCity$ = toObservable(this.query).pipe(
      switchMap((value) => {
        if (!value) {
          return this.cityService.getCity().pipe(map((city) => city.name))
        }
        return of(value);
      }),
      first()
    );
    const city$ = concat(initCity$, this.search$).pipe(share());

    connect<CityState>(this.state).with(
      city$,
      (state, name) => ({
        ...state,
        name
      })
    )

    // effect(() => {
    //   const city = this.city()
    //   console.log('city', city);
    //   this.fireStoreService.findByQuery([where('name', '==', city)]).pipe(first()).subscribe(console.log)
    // })
  }

  // private addCity(city: City) {
  //   return this.fireStoreService.add(city);
  // }
  //
  // private updateCity(city: City) {
  //   return this.fireStoreService.update('7898FiAxn77UN2qMiiIY', {name: city.name});
  // }

  // private setCity(city: City) {
  //   return this.fireStoreService.set(city);
  // }


  // private getCityByName(name: string) {
  //   return this.fireStoreService.findByQuery([where('name', '==', name)]).pipe(
  //     switchMap((cities) => {
  //       if(cities.length > 0) {
  //         return of(cities[0])
  //       }
  //       return this.cityService.getCity();
  //     })
  //   );
  // }
}
