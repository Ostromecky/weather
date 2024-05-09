import {EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders} from "@angular/core";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ToastService} from "./toast.model";
import {SnackbarService} from "./snackbar.service";

export function provideRootToast(): EnvironmentProviders {
  return makeEnvironmentProviders([
    importProvidersFrom(MatSnackBarModule),
    {
      provide: ToastService,
      useClass: SnackbarService
    }
  ]);
}
