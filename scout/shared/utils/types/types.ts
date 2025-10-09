import { Timestamp } from '@google-cloud/firestore';

export type Branding<Type, Name extends string> = Type & { __brand: Name };

type IsBrand<T> = [T] extends [{ __brand: infer _ }] ? true : false;

type Unbrand<T> = T extends infer U & { __brand: any } ? U : T;

type HasNumericIndex<T> = number extends keyof T ? true : false

export type IsPlainObject<T> = [Unbrand<T>] extends [object]
  ? [Unbrand<T>] extends [Function]
    ? false
    : [T] extends [Array<infer U>]
    ? false
    : // 他媽的這個一定要在前面，因為如果是 branded string，
    HasNumericIndex<Unbrand<T>> extends true
    ? false
    : IsBrand<T> extends true
    ? false
    : T extends
        | Date
        | RegExp
        | Map<any, any>
        | Set<any>
        | WeakMap<any, any>
        | WeakSet<any>
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

export type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}`
    ? `${T extends Capitalize<T>
        ? '_'
        : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
    : S;

  export type KeysToSnakeCase<T> = {
    [K in keyof T as CamelToSnakeCase<string & K>]: T[K];
  };