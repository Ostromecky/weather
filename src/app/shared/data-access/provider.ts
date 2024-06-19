import {InjectionToken, Provider} from "@angular/core";
import {FireStoreService} from "./fire-store.service";

export type FireStoreConfig = {
  collection: string;
}

export const FIRE_STORE_CONFIG = new InjectionToken<FireStoreConfig>('FIRE_STORE_CONFIG');

export function provideFirestoreDatabase(config: FireStoreConfig): Provider[] {
  return [
    {
      provide: FIRE_STORE_CONFIG,
      useValue: config
    },
    FireStoreService,
  ]
}
