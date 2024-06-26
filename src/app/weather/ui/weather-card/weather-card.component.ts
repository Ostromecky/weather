import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {Weather} from "../../data-access/weather.model";
import {MatCardModule} from "@angular/material/card";
import {DecimalPipe, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {IconPipe} from "../pipes/icon.pipe";
import {SkeletonDirective} from "../../../shared/ui/skeleton/skeleton.directive";

@Component({
  selector: 'app-weather-card',
  imports: [MatCardModule, DecimalPipe, NgOptimizedImage, IconPipe, SkeletonDirective, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './weather-card.component.scss',
  template: `
    <mat-card>
      @if (weather(); as weather) {
        <mat-card-header>
          <mat-card-title>{{ weather.name }}, {{ weather.sys.country }}</mat-card-title>
          <mat-card-subtitle>{{ weather.weather[0].main }}</mat-card-subtitle>
        </mat-card-header>
        <img mat-card-image [ngSrc]="weather.weather[0].icon | appWeatherIcon" width="250" height="250"
             [alt]="weather.weather[0].main" priority>
        <mat-card-content>
          <h1 class="mat-headline-large">{{ weather.main.temp | number: '1.0-0' }} <span [innerHTML]="celcius"></span></h1>
          <p>Pressure: {{ weather.main.pressure }} hPa</p>
          <p>Humidity: {{ weather.main.humidity }} %</p>
          <p>Wind: {{ weather.wind.speed }} m/s</p>
        </mat-card-content>
      } @else {
        <ng-container *ngTemplateOutlet="loading"></ng-container>
      }
    </mat-card>
    <ng-template #loading>
      <mat-card-header>
        <mat-card-title *skeleton="true;
                height: '32px';
                width: '200px'
                className: 'mb-2'">
        </mat-card-title>
        <mat-card-subtitle *skeleton="true;
                height: '22px';
                width: '100px'
                className: 'mb-2'">
        </mat-card-subtitle>
      </mat-card-header>
      <p class="img-skeleton" mat-card-image *skeleton="true;
                height: '250px';
                width: '100%'
                className: 'mb-2'"></p>
      <mat-card-content>
        <p *skeleton="true;
                repeat: 4;
                height: '20px';
                width: '75px'
                className: 'mb-2'">
        </p>
      </mat-card-content>
    </ng-template>
  `,
  standalone: true
})
export class WeatherCardComponent {
  weather: InputSignal<Weather | undefined> = input<Weather | undefined>();
  protected celcius = '&#8451;';
}
