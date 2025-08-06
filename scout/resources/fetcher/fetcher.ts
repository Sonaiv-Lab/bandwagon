import { Metadata, Resource } from '#shared/resource';

export type FetcherConfig = Record<string, never>;

export interface FetcherMetadata extends Metadata<'fetcher', FetcherConfig> {}

// 有沒有什麼 fetcher 的共同特徵？算了先留著
export type Fetcher = (props: void) => Promise<string>;

export class FetcherResource<T extends Fetcher> extends Resource<
  FetcherMetadata,
  T
> {}
