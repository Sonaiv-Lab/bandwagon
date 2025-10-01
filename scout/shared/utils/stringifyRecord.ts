import { DecodedFormdata } from "./formdata";


// 這應該要更泛用的，類似 react query keys 的作法，但現在先這樣 (?)
export const stringifyRecord = (params: DecodedFormdata) => {
  const bodyKeys = Object.keys(params).sort();
  const stableBodyStringified = bodyKeys
    .map((key) => {
      const value = String(params[key]);
      return `${key}=${value}`;
    })
    .join(',');

  return stableBodyStringified
}