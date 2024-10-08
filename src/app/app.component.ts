import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { defer, filter, switchMap, tap } from "rxjs";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastService } from "./shared/ui/toast/toast.model";

@UntilDestroy()
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
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
