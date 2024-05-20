type Params = { [key: string]: string | number | boolean | string[] | number[] };

const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

export const toUrl = <T extends Params, K extends keyof T = keyof T>(url: string, params?: Record<K, T[K]>): string => {
  if (!params) return url;
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) {
      throw new Error(`Value for key ${key} is undefined`);
    }
    if (isArray(value)) {
      urlParams.append(key, value.join(','));
      return;
    }
    urlParams.append(key, (value as Params[keyof Params]).toString());
  });
  return `${url}?${urlParams.toString()}`;
};
