import {HttpParams} from "@angular/common/http";

type Param = string | number | boolean;

export class TypeSafeHttpParams<T extends Record<string, Param>, K extends keyof T = keyof T> {
  htpParams: HttpParams = new HttpParams();

  set(key: K, value: T[K]): TypeSafeHttpParams<T> {
    this.htpParams.set(key as string, value);
    return this;
  }

  build(): HttpParams {
    return this.htpParams;
  }
}
