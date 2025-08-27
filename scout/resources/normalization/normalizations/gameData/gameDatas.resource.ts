import { Resource, ResourceInfo } from '#shared/resource';
import { NormalizationMetadata, NormalizationResource } from '../../normalization';
// @resource(entry) import
import entry from './gameDatas';
// @resource(json)
import fetchGamedatas from '#resources/fetcher/fetchers/fetchgamedatas/fetchGamedatas.resource.json';
// @resource(json)
import gameSchemaResource from '#resources/schema/schemas/game/game.resource.json';

import info from './gameDatas.resource.json';

// metadata 不能有任何 external reference
export const metadata: NormalizationMetadata = {
  type: 'normalization',
  name: 'gameDatas',
  version: '0.0.1',
  // 只能 import json...
  deps: [gameSchemaResource.id],
  config: {
    from: fetchGamedatas.id,
    to: '', // 這個好像子不太對，再調整一下這裡要改什麼
  },
  info: {
    tags: ['cpbl', 'gameDatas'],
    description: '處理來自 getgamedatas 的資料: gameDatas',
  },
};

// 必須要有這個
export const NormalizeGameDatas = new NormalizationResource(
  info as ResourceInfo<NormalizationMetadata>,
  entry
);
