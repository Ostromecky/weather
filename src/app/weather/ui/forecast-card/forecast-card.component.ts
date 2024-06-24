import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {WeatherForecast} from "../../data-access/weather.model";
import {MatCardModule} from "@angular/material/card";
import {DatePipe, DecimalPipe, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {IconPipe} from "../pipes/icon.pipe";
import {SkeletonDirective} from "../../../shared/ui/skeleton/skeleton.directive";

@Component({
  selector: 'app-forecast-card',
  imports: [MatCardModule, DecimalPipe, NgOptimizedImage, MatListModule, IconPipe, SkeletonDirective, NgTemplateOutlet, DatePipe],
  styleUrl: './forecast-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Forecast</mat-card-title>
        <mat-card-subtitle>5 days</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <mat-list>
          @if (forecast(); as forecast) {
            @for (item of forecast.list; track item.main.temp) {
              <mat-list-item>
                <!--                //TODO - remove inline styles-->
                <span style="margin-right: 16px">{{ item.date | date: 'EEE' }}</span>
                <img class="forecast-item-image" mat-card-image [ngSrc]="item.weather[0].icon | appWeatherIcon"
                     width="24" height="24"
                     [alt]="item.weather[0].main" priority>
                <span>{{ item.main.tempMin | number: '1.0-0' }} / {{ item.main.tempMax | number: '1.0-0' }} <span
                  [innerHTML]="celcius"></span></span>
              </mat-list-item>
              <mat-divider></mat-divider>
            }
          } @else {
            <ng-container *ngTemplateOutlet="loading"></ng-container>
          }
        </mat-list>
      </mat-card-content>
    </mat-card>

    <ng-template #loading>
      @for (i of skeletons; track i) {
        <mat-list-item>
          <span *skeleton="true;
                height: '16px';
                width: '150px';
                "></span>
        </mat-list-item>
        <mat-divider></mat-divider>
      }
    </ng-template>
  `,
  standalone: true
})
export class ForecastCardComponent {
  forecast: InputSignal<WeatherForecast | undefined> = input<WeatherForecast | undefined>();
  protected celcius = '&#8451;';
  protected skeletons = new Array(6);
}
