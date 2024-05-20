import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {WeatherForecast} from "../../data-access/weather.model";
import {MatCardModule} from "@angular/material/card";
import {DecimalPipe, NgOptimizedImage} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {IconPipe} from "../pipes/icon.pipe";

@Component({
  selector: 'app-forecast-card',
  imports: [MatCardModule, DecimalPipe, NgOptimizedImage, MatListModule, IconPipe],
  styleUrl: './forecast-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      @if (forecast(); as forecast) {
        <mat-card-header>
          <mat-card-title>Forecast</mat-card-title>
          <mat-card-subtitle>5 days</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            @for (item of forecast.list; track item.main.temp) {
              <mat-list-item>
                <span style="margin-right: 16px">Mon</span>
                <img class="forecast-item-image" mat-card-image [ngSrc]="item.weather[0].icon | appWeatherIcon" width="24" height="24"
                     [alt]="item.weather[0].main" priority>
                <span>{{ item.main.tempMin | number: '1.0-0' }} / {{ item.main.tempMax | number: '1.0-0' }} <span [innerHTML]="celcius"></span></span>
              </mat-list-item>
              <mat-divider></mat-divider>
            }
          </mat-list>
        </mat-card-content>
      }
    </mat-card>
  `,
  standalone: true
})
export class ForecastCardComponent {
  forecast: InputSignal<WeatherForecast | undefined> = input<WeatherForecast | undefined>();
  protected celcius = '&#8451;';
}
