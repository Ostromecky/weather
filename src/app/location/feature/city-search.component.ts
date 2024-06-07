import {ChangeDetectionStrategy, Component, inject, model} from '@angular/core';
import {AutocompleteComponent} from "./autocomplete/autocomplete.component";
import {FormsModule} from "@angular/forms";
import {CitySearchService} from "../data-access/city-search.service";

@Component({
  selector: 'app-city-search',
  template: `
    <app-city-autocomplete [options]="options" [placeholder]="placeholder()" [ngModel]="city()" (ngModelChange)="handleCityChange($event)"></app-city-autocomplete>
  `,
  standalone: true,
  imports: [
    AutocompleteComponent,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CitySearchComponent {
  protected placeholder = model<string>('Type to search for a city');
  protected options = [
    'Wrocław',
    'Poznań',
    'New York',
    'Warszawa',
    'Opole'
  ]
  private citySearchService: CitySearchService = inject(CitySearchService);
  protected city = this.citySearchService.city;

  handleCityChange(city: string) {
    this.citySearchService.search$.next(city)
  }
}
