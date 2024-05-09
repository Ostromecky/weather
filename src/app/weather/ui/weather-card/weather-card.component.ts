import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {Weather} from "../../data-access/weather.model";
import {MatCardModule} from "@angular/material/card";
import {DecimalPipe, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-weather-card',
  imports: [MatCardModule, DecimalPipe, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './weather-card.component.scss',
  template: `
    <mat-card>
      @if (weather(); as weather) {
        <mat-card-header>
          <mat-card-title>{{ weather.name }}, {{ weather.sys.country }}</mat-card-title>
          <mat-card-subtitle>{{ weather.weather[0].main }}</mat-card-subtitle>
        </mat-card-header>
        <img mat-card-image [ngSrc]="iconUrl()" width="250" height="250"
             [alt]="weather.weather[0].main" priority>
        <mat-card-content>
          <h1>{{ weather.main.temp | number: '1.0-0' }} <span [innerHTML]="celcius"></span></h1>
          <p>Pressure: {{ weather.main.pressure }} hPa</p>
          <p>Humidity: {{ weather.main.humidity }} %</p>
          <p>Wind: {{ weather.wind.speed }} m/s</p>
        </mat-card-content>
      }
    </mat-card>
  `,
  standalone: true
})
export class WeatherCardComponent {
  weather: InputSignal<Weather | undefined> = input<Weather | undefined>();
  iconUrl: InputSignal<string> = input.required<string>();
  protected celcius = '&#8451;';
}
