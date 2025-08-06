import { z } from 'zod';
import { Timestamp } from '@google-cloud/firestore';
import type { DatetimeString, NullableDatetimeString } from './time';
import type { IsPlainObject } from './types';

export type ToFirestoreDocument<T> = {
  [K in keyof T]: T[K] extends DatetimeString
    ? Timestamp
    : T[K] extends NullableDatetimeString
    ? Timestamp | null
    : T[K] extends Array<infer U>
    ? Array<ToFirestoreDocument<U>>
    : IsPlainObject<T[K]> extends true
    ? ToFirestoreDocument<T[K]>
    : T[K];
} & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export const firestoreTimestampSchema = z.instanceof(Timestamp);
