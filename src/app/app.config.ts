import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import { provideHttpClient } from "@angular/common/http";
import {provideServiceWorker} from '@angular/service-worker';
import {provideRootToast} from "./shared/ui/toast/toast.providers";
import {getApp, initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../environments/environment";
import {connectFunctionsEmulator, getFunctions, provideFunctions} from "@angular/fire/functions";
import {connectFirestoreEmulator, getFirestore, initializeFirestore, provideFirestore} from "@angular/fire/firestore";
import {provideFirestoreDatabase} from "./shared/data-access/provider";
import {provideLayoutService} from "./shared/ui/layout/provider";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideHttpClient(), provideServiceWorker('ngsw-worker.js', {
    enabled: !isDevMode(),
    registrationStrategy: 'registerWhenStable:30000'
  }), provideRootToast(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFunctions(() => {
      const functions = getFunctions();
      if (isDevMode()) {
        connectFunctionsEmulator(getFunctions(), 'localhost', 5001);
      }
      return functions;
    }),
    provideFirestore(() => {
      const app = getApp();
      if (isDevMode()) {
      const firestore = getFirestore(app)
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      return firestore;
      }
      return initializeFirestore(app, {});
    }),
    provideFirestoreDatabase({collection: 'cities'}),
    provideLayoutService()
  ]
};
