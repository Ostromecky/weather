import {inject, Injectable} from '@angular/core';
import {GeolocationService} from "./geolocation.service";
import {HttpClient} from "@angular/common/http";
import {filter, map, Observable, switchMap} from "rxjs";

@Injectable({providedIn: 'root'})
export class CityService {
  private geoLocation: GeolocationService = inject(GeolocationService);
  private http: HttpClient = inject(HttpClient);
  private url = `https://maps.googleapis.com/maps/api/geocode`
  private apiKey = 'AIzaSyBe1tzipxqgpzihxZRD2RLPmCEYGLtANQ8'

  getCity(): Observable<string> {
    const geolocation$ = this.geoLocation.getCurrentPosition();
    return geolocation$.pipe(
      filter(Boolean),
      switchMap((position) => this.getCityByGeolocation(position.coords.latitude, position.coords.longitude))
    );
  }

  private getCityByGeolocation(latitude: number, longitude: number): Observable<string> {
    return this.http.get(`${this.url}/json?latlng=${latitude},${longitude}&key=${this.apiKey}`).pipe(
      map((data: any) => data.results[0].address_components.find((component: any) => component.types.includes('locality')).long_name),
    );
  }
}
