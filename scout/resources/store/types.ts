import { Metadata, Resource } from '#shared/resource';

type StoreConfig = {
  collectionName: string;
};

export interface StoreMetadata extends Metadata<'store', StoreConfig> {}

type Store = unknown;

class SchemaResource<T extends Store> extends Resource<
  StoreMetadata,
  T
> {}
