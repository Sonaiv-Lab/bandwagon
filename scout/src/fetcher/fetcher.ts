import { Metadata } from '#resource/resource';

export type FetcherConfig = Record<string, never>;

export interface FetcherMetadata extends Metadata<'fetcher', FetcherConfig> {}

// 有沒有什麼 fetcher 的共同特徵？算了先留著
export type Fetcher = <TParameter, TData>(parameter: TParameter) => TData;
