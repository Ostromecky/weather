import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {WeatherFacade} from "../data-access/weather.facade";
import {MatIcon} from "@angular/material/icon";
import {WeatherCardComponent} from "../ui/weather-card/weather-card.component";
import {ForecastCardComponent} from "../ui/forecast-card/forecast-card.component";

@Component({
  selector: 'app-weather',
  template: `
    <div class="weather-container">
      <app-weather-card [weather]="weatherFacade.weather()"></app-weather-card>
      <app-forecast-card [forecast]="weatherFacade.forecast()"></app-forecast-card>
    </div>
  `,
  styleUrls: ['./weather.component.scss'],
  standalone: true,
  providers: [WeatherFacade],
  imports: [MatIcon, WeatherCardComponent, ForecastCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WeatherComponent {
  protected weatherFacade: WeatherFacade = inject(WeatherFacade);
}
