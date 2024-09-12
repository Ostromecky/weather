import { Component, inject, signal } from '@angular/core';
import { LayoutService } from '../../shared/ui/layout/layout.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CitySearchComponent } from '../../location/feature/city-search.component';
import { NgClass } from '@angular/common';
import { WeatherComponent } from '../feature/weather.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-weather-page',
  template: `
    <mat-toolbar class="mat-elevation-z0 my-toolbar">
      @if (layoutService.screenSize() === 'Web') {
        <div class="toolbar-prefix">
          <span>Weather App</span>
          <app-city-search/>
        </div>
        <span class="spacer"></span>
        <button mat-icon-button>
          <mat-icon>share</mat-icon>
        </button>
      } @else {
        @if (isMobileSearchActive()) {
          <app-city-search [ngClass]="{'full-width': isMobileSearchActive()}"/>
          <span class="spacer"></span>
          <button (click)="isMobileSearchActive.set(false)" mat-icon-button>
            <mat-icon>close</mat-icon>
          </button>
        } @else {
          <div class="toolbar-prefix">
            <span>Weather App</span>
          </div>
          <span class="spacer"></span>
          <button (click)="isMobileSearchActive.set(true)" mat-icon-button>
            <mat-icon>search</mat-icon>
          </button>
        }
      }
    </mat-toolbar>
    <div class="content-wrapper">
      <app-weather></app-weather>
    </div>
  `,
  standalone: true,
  styleUrls: ['./weather.page.scss'],
  imports: [MatIconModule, WeatherComponent, MatButtonModule, CitySearchComponent, NgClass, MatToolbarModule]
})

export class WeatherPageComponent {
  protected layoutService = inject(LayoutService);
  protected isMobileSearchActive = signal<boolean>(false);
}
