import { AbstractFireStoreService } from '../../shared/data-access/abstract-fire-store.service';
import { City } from './city.model';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class CityFiresStoreService extends AbstractFireStoreService<City> {

  constructor() {
    super({
      collection: 'cities'
    });
  }
}
