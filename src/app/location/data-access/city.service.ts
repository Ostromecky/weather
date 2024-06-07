import {inject, Injectable} from '@angular/core';
import {GeolocationService} from "./geolocation.service";
import {filter, from, map, Observable, of, switchMap} from "rxjs";
import {Functions, httpsCallable} from "@angular/fire/functions";
import {FieldPath, where} from "@angular/fire/firestore";
import {FireStoreService} from "../../shared/data-access/fire-store.service";
import {City, CityServer} from "./city.model";

@Injectable({providedIn: 'root'})
export class CityService {
  private geoLocation: GeolocationService = inject(GeolocationService);
  private functions: Functions = inject(Functions);
  private fireStoreService: FireStoreService<City> = inject(FireStoreService);

  constructor() {
    this.functions.region = 'europe-central2';
  }

  getCity(): Observable<CityServer> {
    const geolocation$ = this.geoLocation.getCurrentPosition();
    return geolocation$.pipe(
      filter(Boolean),
      switchMap((position) => this.getCityByGeolocation(position.coords.latitude, position.coords.longitude))
    );
  }

  private getCityByName(name: string): Observable<CityServer> {
    return this.fireStoreService.findByQuery([where('name', '==', name)]).pipe(
      map((cities) => cities[0])
    );
  }

  private getCityByGeolocation(latitude: number, longitude: number): Observable<CityServer> {
    latitude = this.roundOneDigit(latitude);
    longitude = this.roundOneDigit(longitude);
    const latitudePath = new FieldPath('location', 'latitude');
    const longitudePath = new FieldPath('location', 'longitude');
    return this.fireStoreService.findByQuery([where(latitudePath, '==', latitude), where(longitudePath, '==', longitude)]).pipe(
      switchMap((cities) => {
        if (cities.length > 0) {
          return of(cities[0]);
        }
        return this.fetchCityByGeolocation(latitude, longitude).pipe(
          switchMap((city) => {
              return this.fireStoreService.findByQuery([where('name', '==', city)]).pipe(
                switchMap((cities) => {
                    if (cities.length === 0) {
                      return this.fireStoreService.add({
                        name: city,
                        location: {latitude, longitude}
                      }).pipe(map(() => city)).pipe(
                        map((id) => this.toEntity(id, {name: city, location: {latitude, longitude}})
                        ))
                    }
                    return of(cities[0]);
                  }
                ));
            }
          )
        );
      })
    );
  }

  private fetchCityByGeolocation(latitude: number, longitude: number): Observable<string> {
    const callable = from(httpsCallable<{ latitude: number, longitude: number }, string>(this.functions, 'getCity')({
      latitude,
      longitude
    }));
    return callable.pipe(
      map((response) => response.data)
    );
  }

  private roundOneDigit(value: number) {
    return Math.round(value * 10) / 10;
  }

  private toEntity(id: string, city: City): CityServer {
    return {
      ...city,
      id: city.name
    }
  }
}
