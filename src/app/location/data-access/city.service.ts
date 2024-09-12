import { inject, Injectable } from '@angular/core';
import { GeolocationService } from "./geolocation.service";
import { filter, from, map, Observable, of, switchMap } from "rxjs";
import { Functions, httpsCallable } from "@angular/fire/functions";
import { FieldPath, or, where } from "@angular/fire/firestore";
import { City, CityServer } from "./city.model";
import { CityFiresStoreService } from './city-fires-store.service';

@Injectable({providedIn: 'root'})
export class CityService {
  private geoLocation: GeolocationService = inject(GeolocationService);
  private functions: Functions = inject(Functions);
  private fireStoreService: CityFiresStoreService = inject(CityFiresStoreService);

  constructor() {
    this.functions.region = 'europe-central2';
  }

  initCity(name?: string): Observable<CityServer> {
    if (name) {
      return this.getCityByName(name);
    }
    const geolocation$ = this.geoLocation.getCurrentPosition();
    return geolocation$.pipe(
      filter(Boolean),
      switchMap((position) => this.getCityByGeolocation(position.coords.latitude, position.coords.longitude))
    );
  }

  searchCitiesByName(name: string): Observable<CityServer[]> {
    return this.fireStoreService.findByQuery(cityQuery(name)).pipe(
      map((cities) => cities)
    );
  }

  getCityByName(name: string): Observable<CityServer> {
    return this.fireStoreService.findByQuery(cityQuery(name)).pipe(
      switchMap((cities) => {
          if (cities.length === 0) {
            return this.fetchCityByName(name).pipe(
              switchMap((city) => {
                return this.fireStoreService.add({
                  name: city.name,
                  location: {
                    latitude: this.roundOneDigit(city.location.latitude),
                    longitude: this.roundOneDigit(city.location.longitude)
                  }
                })
              })
            )
          }
          return of(cities[0]);
        }
      ));
  }

  private getCityByGeolocation(latitude: number, longitude: number): Observable<CityServer> {
    latitude = this.roundOneDigit(latitude);
    longitude = this.roundOneDigit(longitude);
    const latitudePath = new FieldPath('location', 'latitude');
    const longitudePath = new FieldPath('location', 'longitude');
    return this.fireStoreService.findByQuery(where(latitudePath, '==', latitude), where(longitudePath, '==', longitude)).pipe(
      switchMap((cities) => {
        if (cities.length > 0) {
          return of(cities[0]);
        }
        return this.fetchCityByGeolocation(latitude, longitude).pipe(
          switchMap((city) =>
            this.checkCityInDatabase(city.name, latitude, longitude)
          )
        );
      })
    );
  }

  private checkCityInDatabase(city: string, latitude: number, longitude: number) {
    return this.fireStoreService.findByQuery(cityQuery(city)).pipe(
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

  private fetchCityByGeolocation(latitude: number, longitude: number): Observable<City> {
    const callable = from(httpsCallable<{
      location: { latitude: number, longitude: number },
      name?: string
    }, City>(this.functions, 'getCity')({
      location: {
        latitude,
        longitude
      },
      name: undefined
    }));
    return callable.pipe(
      map((response) => response.data)
    );
  }

  private fetchCityByName(name: string): Observable<City> {
    const callable = from(httpsCallable<{
      location?: { latitude: number, longitude: number },
      name: string
    }, City>(this.functions, 'getCity')({
      location: undefined,
      name
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
      id
    }
  }
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const cityQuery = (cityName: string) =>  or(where('name', '==', capitalizeFirstLetter(cityName)), where('name', '==', cityName))

