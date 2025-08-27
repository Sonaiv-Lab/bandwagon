import { Timestamp } from '@google-cloud/firestore';

export type Branding<Type, Name extends string> = Type & { __brand: Name };

type IsBrand<T> = T extends { __brand: infer _ } ? true : false;

export type IsPlainObject<T> = [T] extends [object]
  ? [T] extends [Function]
    ? false
    : [T] extends [Array<infer U>]
    ? false
    : [T] extends [{ [k: number]: infer V }]
    ? true
    : T extends Date
    ? false
    : IsBrand<T> extends true
    ? false
    : true
  : false;

export type DeepMapType<T, From, To> = T extends Array<infer U>
  ? Array<DeepMapType<U, From, To>>
  : IsPlainObject<T> extends true
  ? {
      [K in keyof T]: DeepMapType<T[K], From, To>;
    }
  : T extends From
  ? To
  : From;

// Input 一定要符合 Target，不然會是 never
export type MustSatisfy<Input, Target> = Input extends Target ? Input : never;

export type AnyFunctionWithReturn = (...args: any[]) => any;

export type DeepPartial<T> = [T] extends [
  Branding<infer X, infer TName extends string>
]
  ? Branding<DeepPartial<X>, TName>
  : [T] extends [Array<infer U>]
  ? Array<DeepPartial<U>>
  : [T] extends [{ [k: number]: infer V }]
  ? { [k: number]: DeepPartial<V> }
  : IsPlainObject<T> extends true
  ? {
      [K in keyof T]?: DeepPartial<T[K]>;
    }
  : T;


export type JSONlike = Record<string | number, unknown>