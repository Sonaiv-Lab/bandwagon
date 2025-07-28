// resource.ts 就只留一些 resource 的 metadata

import type { FetcherMetadata } from '../fetcher';
import { Resource, ResourceInfo } from '#resource/resource';
import info from './fetchSchedulePage.resource.json';
// @resource: entry import
import entry from './fetchSchedulePage';

// metadata 不能有任何 external reference
export const metadata: FetcherMetadata = {
  type: 'fetcher',
  name: 'main_page',
  version: '0.0.1',
  config: {},
  info: {
    tags: ['cpbl', 'schedule'],
    description: '拿賽程頁的資料',
  },
};

// 必須要有這個

const FetchSchedulePage = new Resource(
  info as ResourceInfo<FetcherMetadata>,
  entry
);

export default FetchSchedulePage;
