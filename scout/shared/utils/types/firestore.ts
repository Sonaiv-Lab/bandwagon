import { z } from 'zod';
import { Timestamp, FieldValue } from '@google-cloud/firestore';
import type { IsPlainObject, Branding } from './types';

type FsMap<T> = Branding<Record<number, T>, 'firestore_map'>;

export const createFsMapFromArr = <T>(arr: Array<T>) => {
  const fsMap = {} as FsMap<T>;

  arr.forEach((ele, i) => {
    fsMap[i] = ele;
  });

  return fsMap;
};

export type ToFirestoreDoc<T> = {
  // firestore 的 Array 有限制，全部存成 Map (JS 的 object with numeric key )
  [K in keyof T]: T[K] extends Array<infer U>
    ? FsMap<ToFirestoreDoc<U>>
    : IsPlainObject<T[K]> extends true
    ? ToFirestoreDoc<T[K]>
    : T[K];
} & { createdAt: FieldValue; updatedAt: FieldValue };

export const firestoreTimestampSchema = z.instanceof(Timestamp);
