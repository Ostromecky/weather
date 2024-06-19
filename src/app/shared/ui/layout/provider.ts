import {EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders} from "@angular/core";
import {LayoutModule} from "@angular/cdk/layout";
import {LayoutService} from "./layout.service";

export const provideLayoutService = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    importProvidersFrom(LayoutModule),
    LayoutService,
  ]);
}
