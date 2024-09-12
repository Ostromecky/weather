import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./weather/pages/weather.page').then(m => m.WeatherPageComponent)
  }
];
