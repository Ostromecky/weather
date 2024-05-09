import {HttpParams} from "@angular/common/http";

type Params = { [key: string]: string | number | boolean };

export class HttpParamsBuilder<PType extends Params> {
  htpParams: HttpParams = new HttpParams();

  set<K extends keyof PType>(key: K, value: PType[K]): HttpParamsBuilder<PType> {
    this.htpParams.set(key as string, value);
    return this;
  }

  build(): HttpParams {
    return this.htpParams;
  }
}
