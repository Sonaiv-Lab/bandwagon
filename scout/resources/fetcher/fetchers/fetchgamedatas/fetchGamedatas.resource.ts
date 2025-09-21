import { FetcherMetadata } from '../../fetcher';

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

export * from './fetchGamedatas';