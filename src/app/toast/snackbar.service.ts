import {inject, Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, TextOnlySnackBar} from '@angular/material/snack-bar';
import {Observable, Subject} from 'rxjs';
import {ToastDismiss, ToastService} from './toast.model';

@Injectable()
export class SnackbarService implements ToastService {
  private defaultDuration = 5000;
  private snackBar = inject(MatSnackBar);
  private readonly defaultActionLabel = 'OK';

  show$(
    message: string,
    duration = this.defaultDuration,
    actionLabel?: string,
    panelClass = 'neutral'
  ): Observable<ToastDismiss> {
    const dismiss$ = new Subject<ToastDismiss>();
    this.createSnackBar(message, duration, actionLabel, panelClass).afterDismissed().subscribe(dismissedByAction => dismiss$.next(dismissedByAction));
    return dismiss$.asObservable();
  }

  showError$(message: string, duration = this.defaultDuration, actionLabel?: string): Observable<ToastDismiss> {
    return this.show$(message, duration, actionLabel, 'error');
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }

  private createSnackBar(
    message: string,
    duration: number,
    actionLabel: string = this.defaultActionLabel,
    panelClass: string
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, actionLabel, {
      duration,
      panelClass: ['app-toast', panelClass]
    })
  }
}
