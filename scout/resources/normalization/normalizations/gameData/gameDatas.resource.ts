import { NormalizationMetadata } from '../../normalization';

// metadata 不能有任何 external reference
export const metadata: NormalizationMetadata = {
  type: 'normalization',
  name: 'gameDatas',
  version: '0.0.1',
  // 只能 import json...
  deps: [],
  config: {
    from: '',
    to: '', // 這個好像子不太對，再調整一下這裡要改什麼
  },
  info: {
    tags: ['cpbl', 'gameDatas'],
    description: '處理來自 getgamedatas 的資料: gameDatas',
  },
};

export * from './gameDatas';