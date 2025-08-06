import { Metadata, Resource } from '#shared/resource';
import { AnyFunctionWithReturn } from "#shared/utils/types";

export type SchemaConfig = {
};

export interface SchemaMetadata
  extends Metadata<'schema', SchemaConfig> {}

// 有沒有什麼 fetcher 的共同特徵？算了先留著
export type Schema = Record<string, AnyFunctionWithReturn>;

export class SchemaResource<T extends Schema> extends Resource<
  SchemaMetadata,
  T
> {}
