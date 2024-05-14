import {inject, Injectable} from '@angular/core';
import {GeolocationService} from "./geolocation.service";
import {filter, from, map, Observable, switchMap} from "rxjs";
import {Functions, httpsCallable} from "@angular/fire/functions";

@Injectable({providedIn: 'root'})
export class CityService {
  private geoLocation: GeolocationService = inject(GeolocationService);
  private functions: Functions = inject(Functions);

  getCity(): Observable<string> {
    const geolocation$ = this.geoLocation.getCurrentPosition();
    return geolocation$.pipe(
      filter(Boolean),
      switchMap((position) => this.getCityByGeolocation(position.coords.latitude, position.coords.longitude))
    );
  }

  private getCityByGeolocation(latitude: number, longitude: number): Observable<string> {
    this.functions.region = 'europe-central2';
    const callable = from(httpsCallable<{ latitude: number, longitude: number }, string>(this.functions, 'getCity')({
      latitude,
      longitude
    }));
    return callable.pipe(
      map((response) => response.data),
    );
  }
}
