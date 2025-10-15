import { z } from 'zod';
import { ServerTimestamp, FsTimestamp } from '#shared/external/firestore';
import type { IsPlainObject } from './types';
import { DatetimeString } from './datetimeString';

type FsMap<T> = Record<number, T>;

export const fromArrToFsMap = <T>(arr: Array<T>) => {
  const fsMap = {} as FsMap<T>;

  arr.forEach((ele, i) => {
    fsMap[i] = ele;
  });

  return fsMap;
};

export const fromFsMapToArr = <T>(fsmap: FsMap<T>) => {
  return Object.entries(fsmap)
    .sort(([keyA], [keyB]) => +keyA - +keyB)
    .map(([, value]) => value);
};

export const createFsMapSchema = (objSchema: z.ZodObject) => {
  return z.custom<FsMap<typeof objSchema>>((input) => {
    const result = z.record(z.number(), objSchema).safeParse(input);
    return result.success;
  });
};

const fsMapCodecSchema = z.codec(
  z.record(z.number(), z.object()),
  z.array(z.object()),
  {
    decode(fsmap) {
      return Object.entries(fsmap)
        .sort(([keyA], [keyB]) => +keyA - +keyB)
        .map(([, value]) => value);
    },
    encode(arr) {
      const fsMap = {} as FsMap<any>;

      arr.forEach((ele, i) => {
        fsMap[i] = ele;
      });

      return fsMap;
    },
  }
);

type RecordedArray<TElement extends Record<string, unknown>> = Array<TElement>;

type IsDigit<C extends string> = C extends
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' ? true : false;

type IsUpperAlpha<C extends string> = C extends Lowercase<C>
  ? false
  : C extends Uppercase<C>
  ? true
  : false;

type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}`
    ? `${IsDigit<T> & IsUpperAlpha<T> extends true
        ? '_'
        : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
    : S;

    // 和真正的 snake case 有點不一樣，數字前面會加上 _
type KeysToSnakeCase<T> = T extends Array<infer U>
  ? Array<KeysToSnakeCase<U>>
  : IsPlainObject<T> extends true
  ? {
      [K in keyof T as CamelToSnakeCase<string & K>]: KeysToSnakeCase<T[K]>;
    }
  : T;

type ToFirestoreTransform<T> = {
  // firestore 的 element Array 有限制，全部存成 Map (JS 的 object with numeric key )
  [K in keyof T]: T[K] extends RecordedArray<infer U>
    ? FsMap<ToFirestoreTransform<U>>
    : IsPlainObject<T[K]> extends true
    ? ToFirestoreTransform<T[K]>
    : T[K];
};

// 這個給存入用的
export type ToFirestoreDocInput<T> = ToFirestoreTransform<KeysToSnakeCase<T>> & {
  created_at: FsTimestamp | ServerTimestamp;
  updated_at: FsTimestamp | ServerTimestamp;
};

// 這個給 Output 用的
export type ToFirestoreDocOutput<T> = ToFirestoreTransform<KeysToSnakeCase<T>> & {
  created_at: FsTimestamp;
  updated_at: FsTimestamp;
};

export type ToFirestoreStore<T> = ToFirestoreTransform<T> & {
  createdAt: DatetimeString;
  updatedAt: DatetimeString;
};
