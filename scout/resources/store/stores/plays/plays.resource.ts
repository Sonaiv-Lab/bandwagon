import type { StoreMetadata } from '../../types';

export const metadata = {
  type: 'store',
  name: 'plays',
  version: '0.0.1',
  config: {
    collectionName: 'plays_v1',
  },
  deps: [],
  info: {
    tags: ['plays'],
    description: '儲存賽次資料',
  },
} as const satisfies StoreMetadata;
