import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {WeatherFacade} from "../data-access/weather.facade";
import {MatInput} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {WeatherCardComponent} from "../ui/weather-card/weather-card.component";
import {ForecastCardComponent} from "../ui/forecast-card/forecast-card.component";

@Component({
  selector: 'app-weather',
  template: `
    <mat-form-field>
      <input [value]="weatherFacade.city()" autocomplete="off" placeholder="Enter city" #cityCtrl matInput>
      <mat-icon matSuffix (click)="search(cityCtrl.value.trim())">search</mat-icon>
    </mat-form-field>
    <div class="weather-container">
      <app-weather-card [weather]="weatherFacade.weather()"></app-weather-card>
      <app-forecast-card [forecast]="weatherFacade.forecast()"></app-forecast-card>
    </div>
  `,
  styleUrls: ['./weather.component.scss'],
  standalone: true,
  providers: [WeatherFacade],
  imports: [MatFormFieldModule, MatInput, ReactiveFormsModule, MatIcon, WeatherCardComponent, ForecastCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WeatherComponent {
  protected weatherFacade: WeatherFacade = inject(WeatherFacade);

  search(city: string) {
    this.weatherFacade.search$.next(city)
  }
}
