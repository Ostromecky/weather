import {ChangeDetectionStrategy, Component, computed, inject, model} from '@angular/core';
import {AutocompleteComponent} from "./autocomplete/autocomplete.component";
import {FormsModule} from "@angular/forms";
import {CitySearchService} from "../data-access/city-search.service";
import {SearchComponent} from "../../shared/search/search.component";

@Component({
  selector: 'app-city-search',
  template: `
    <app-search [placeholder]="placeholder()" [ngModel]="cityName()" (ngModelChange)="handleCityChange($event)"></app-search>
  `,
  standalone: true,
  imports: [
    AutocompleteComponent,
    FormsModule,
    SearchComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CitySearchComponent {
  protected placeholder = model<string>('Type to search for a city');
  private citySearchService: CitySearchService = inject(CitySearchService);
  protected city = this.citySearchService.city;
  protected cityName = computed(() => this.city()?.name || '');

  handleCityChange(city: string) {
    this.citySearchService.search$.next(city)
  }
}
