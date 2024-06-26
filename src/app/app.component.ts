import {Component, inject, OnInit, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {WeatherComponent} from "./weather/feature/weather.component";
import {SwUpdate, VersionReadyEvent} from "@angular/service-worker";
import {defer, filter, switchMap, tap} from "rxjs";
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ToastService} from "./shared/ui/toast/toast.model";
import {CitySearchComponent} from "./location/feature/city-search.component";
import {LayoutService} from "./shared/ui/layout/layout.service";
import {NgClass} from "@angular/common";

@UntilDestroy()
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WeatherComponent, MatToolbarModule, MatIconModule, MatButtonModule, CitySearchComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private updates = inject(SwUpdate);
  private toastService = inject(ToastService);
  protected layoutService = inject(LayoutService);
  protected isMobileSearchActive = signal<boolean>(false);

  ngOnInit() {
    this.updates.versionUpdates.pipe(
      filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'),
      switchMap(() => this.toastService.show$('New version available.', 5000, 'Update now')),
      filter(result => result.dismissedByAction),
      switchMap(() => defer(() => this.updates.activateUpdate()).pipe(
        tap(() => location.reload())
      )),
      untilDestroyed(this)
    ).subscribe()
  }

}
