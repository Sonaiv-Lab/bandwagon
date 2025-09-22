import { z } from 'zod';
import { ServerTimestamp, FsTimestamp } from '#shared/external/firestore';
import type { IsPlainObject, Branding } from './types';
import { DatetimeString } from './datetimeString';

type FsMap<T> = Branding<Record<number, T>, 'firestore_map'>;

export const createFsMapFromArr = <T>(arr: Array<T>) => {
  const fsMap = {} as FsMap<T>;

  arr.forEach((ele, i) => {
    fsMap[i] = ele;
  });

  return fsMap;
};

type RecordedArray<TElement extends Record<string, unknown>> = Array<TElement>;

export type ToFirestoreDoc<T> = {
  // firestore 的 element Array 有限制，全部存成 Map (JS 的 object with numeric key )
  [K in keyof T]: T[K] extends RecordedArray<infer U>
    ? FsMap<ToFirestoreDoc<U>>
    : IsPlainObject<T[K]> extends true
    ? ToFirestoreDoc<T[K]>
    : T[K];
} & {
  createdAt: FsTimestamp | ServerTimestamp;
  updatedAt: FsTimestamp | ServerTimestamp;
};

export type ToFirestoreDocJson<T> = {
  // firestore 的 element Array 有限制，全部存成 Map (JS 的 object with numeric key )
  [K in keyof T]: T[K] extends RecordedArray<infer U>
    ? FsMap<ToFirestoreDocJson<U>>
    : IsPlainObject<T[K]> extends true
    ? ToFirestoreDocJson<T[K]>
    : T[K];
} & {
  createdAt: DatetimeString;
  updatedAt: DatetimeString;
};
