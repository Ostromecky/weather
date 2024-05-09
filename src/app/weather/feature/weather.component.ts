import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {WeatherFacade} from "../data-access/weather.facade";
import {MatInput} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {WeatherCardComponent} from "../ui/weather-card/weather-card.component";

@Component({
  selector: 'app-weather',
  template: `
    <mat-form-field>
      <input [value]="weatherFacade.city()" autocomplete="off" placeholder="Enter city" #cityCtrl matInput>
      <mat-icon matSuffix (click)="search(cityCtrl.value.trim())">search</mat-icon>
    </mat-form-field>
    <app-weather-card [weather]="weatherFacade.weather()" [iconUrl]="iconUrl()"></app-weather-card>
  `,
  styleUrls: ['./weather.component.scss'],
  standalone: true,
  providers: [WeatherFacade],
  imports: [MatFormFieldModule, MatInput, ReactiveFormsModule, MatIcon, WeatherCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WeatherComponent {
  protected weatherFacade: WeatherFacade = inject(WeatherFacade);
  protected iconUrl = computed(() => {
    const weather = this.weatherFacade.weather();
    if (!weather) return '';
    return 'https://openweathermap.org/img/wn/' + weather.weather[0].icon + '@4x.png';
  })

  search(city: string) {
    this.weatherFacade.search$.next(city)
  }
}
