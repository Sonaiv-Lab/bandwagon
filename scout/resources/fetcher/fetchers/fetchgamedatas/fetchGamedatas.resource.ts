// resource.ts 就只留一些 resource 的 metadata

import { FetcherMetadata, FetcherResource } from '../../fetcher';
import { Resource, ResourceInfo } from '#shared/resource';
import info from './fetchGamedatas.resource.json';
// @resource(entry) import
import entry from './fetchGamedatas';

// metadata 不能有任何 external reference
export const metadata: FetcherMetadata = {
  type: 'fetcher',
  name: 'main_page',
  version: '0.0.1',
  deps: [],
  config: {},
  info: {
    tags: ['cpbl', 'schedule'],
    description: '拿賽程頁的資料',
  },
};

export const FetchGetgamedatas = new FetcherResource(
  info as ResourceInfo<FetcherMetadata>,
  entry
);
