import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {WeatherFacade} from "./weather.facade";
import {MatInput} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-weather',
  template: `
    <mat-form-field>
      <input [value]="weatherFacade.city()" autocomplete="off" placeholder="Enter city" #cityCtrl matInput>
      <mat-icon matSuffix (click)="search(cityCtrl.value.trim())">search</mat-icon>
    </mat-form-field>
    @if (weatherFacade.weather(); as weather) {
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ weather.name }}, {{ weather.sys.country }}</mat-card-title>
          <mat-card-subtitle>{{ weather.weather[0].main }}</mat-card-subtitle>
        </mat-card-header>
        <img mat-card-image [src]="'http://openweathermap.org/img/wn/' + weather.weather[0].icon + '@4x.png'"
             [alt]="weather.weather[0].main">
        <mat-card-content>
          <h1>{{ weather.main.temp | number: '1.0-0' }} <span [innerHTML]="celcius"></span></h1>
          <p>Pressure: {{ weather.main.pressure }} hPa</p>
          <p>Humidity: {{ weather.main.humidity }} %</p>
          <p>Wind: {{ weather.wind.speed }} m/s</p>
        </mat-card-content>
      </mat-card>
    }
  `,
  styleUrls: ['./weather.component.scss'],
  standalone: true,
  providers: [WeatherFacade],
  imports: [MatFormFieldModule, MatCardModule, MatInput, ReactiveFormsModule, MatIcon, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WeatherComponent {
  protected weatherFacade: WeatherFacade = inject(WeatherFacade);
  protected celcius = '&#8451;';

  search(city: string) {
    this.weatherFacade.search$.next(city)
  }
}
