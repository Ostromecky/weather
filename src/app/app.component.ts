import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {WeatherComponent} from "./weather/feature/weather.component";
import {SwUpdate, VersionReadyEvent} from "@angular/service-worker";
import {defer, filter, switchMap, tap} from "rxjs";
import {ToastService} from "./toast/toast.model";
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@UntilDestroy()
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WeatherComponent, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private updates = inject(SwUpdate);
  private toastService = inject(ToastService);

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
