import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'appWeatherIcon',
  standalone: true
})

export class IconPipe implements PipeTransform {
  transform(icon: string, ...args: any[]): any {
    return 'https://openweathermap.org/img/wn/' + icon + '@4x.png';
  }
}
