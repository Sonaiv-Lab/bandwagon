// resource.ts 就只留一些 resource 的 metadata

import { FetcherMetadata, FetcherResource } from '../../fetcher';
import { Resource, ResourceInfo } from '#shared/resource';
import info from './fetchFromCpblRequest.resource.json';
// @resource(entry) import
// import entry from './fetchFromCpblRequest';

// metadata 不能有任何 external reference
export const metadata: FetcherMetadata = {
  type: 'fetcher',
  name: 'intercept_from_page',
  version: '0.0.1',
  deps: [],
  config: {},
  info: {
    tags: ['cpbl', 'schedule'],
    description: '拿賽程頁的資料',
  },
};

// export const FetchGetgamedatas = new FetcherResource(
//   info as ResourceInfo<FetcherMetadata>,
//   entry
// );
