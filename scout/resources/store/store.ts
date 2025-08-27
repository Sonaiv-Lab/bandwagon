import { Metadata, Resource } from '#shared/resource';

export type StoreConfig = {
  collectionName: string;
};

export interface StoreMetadata extends Metadata<'store', StoreConfig> {}

export type Store = unknown;

export class SchemaResource<T extends Store> extends Resource<
  StoreMetadata,
  T
> {}
