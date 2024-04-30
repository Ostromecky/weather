import {inject, Injectable} from '@angular/core';
import {NAVIGATOR} from "./geolocation.providers";
import {Observable, Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class GeolocationService {
  private navigator = inject(NAVIGATOR);

  getCurrentPosition(): Observable<GeolocationPosition | undefined> {
    const position$ = new Subject<GeolocationPosition | undefined>();
    if (!this.navigator.geolocation) {
      console.error('Geolocation is not supported');
    }
    this.navigator.geolocation.getCurrentPosition((position: GeolocationPosition) =>
      position$.next(position)
    );
    return position$.asObservable();
  }
}
