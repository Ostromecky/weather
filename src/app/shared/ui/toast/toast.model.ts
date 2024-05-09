import {MatSnackBarDismiss} from "@angular/material/snack-bar";
import {Observable} from "rxjs";

export type ToastDismiss = MatSnackBarDismiss;

export abstract class ToastService {
  abstract show$(
    message: string,
    duration?: number,
    actionLabel?: string,
    panelClass?: string
  ): Observable<ToastDismiss>;

  abstract showError$(message: string, duration?: number, actionLabel?: string): Observable<ToastDismiss>;

  abstract dismiss(): void;
}
