import type { ZodObject, ZodType, ZodEnum } from 'zod';
import { z } from 'zod';

export type SchemaFromInterface<T> = ZodObject<{
  [K in keyof T]: K extends keyof T ? ZodType<T[K]> : never;
}>;

// 把 Record<key, value> 轉成 Record<value, value> 給 ZodEnum 用
type ValueRecord<TRecord extends Readonly<Record<string, string | number>>> =
  Record<string, TRecord[keyof TRecord]>;

export type EnumSchemaFromConstRecord<
  T extends Readonly<Record<string, string | number>>
> = ZodEnum<ValueRecord<T>>;

export const emptyString = z.templateLiteral(['']);
