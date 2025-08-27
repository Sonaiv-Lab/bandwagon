// resource.ts 就只留一些 resource 的 metadata

import type { StoreMetadata } from '../../store';
import { Resource, ResourceInfo } from '#shared/resource';

import info from './games.resource.json';
// @resource(entry) import
import * as entry from './games';


// metadata 不能有任何 external reference
export const metadata: StoreMetadata = {
  type: 'store',
  name: 'games',
  version: '0.0.1',
  config: {
    collectionName: 'game_v1',
  },
  deps: [],
  info: {
    tags: ['games'],
    description: '儲存比賽資料',
  },
};

// 必須要有這個
export const GameStore = new Resource(
  info as ResourceInfo<StoreMetadata>,
  entry
);
