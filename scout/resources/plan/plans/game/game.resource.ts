import { Resource, ResourceInfo } from '#shared/resource';
import { PlanMetadata, PlanResource } from '../../plan';
// @resource(entry) import
import entry from './game';
// @resource(json)
import gameDatasResource from '#resources/normalization/normalizations/gameData/gameDatas.resource.json';
// @resource(json)
import gameStoreResource from '#resources/store/games/games.resource.json';

import info from './game.resource.json';

// metadata 不能有任何 external reference
export const metadata: PlanMetadata = {
  type: 'plan',
  name: 'game',
  version: '0.0.1',
  // 只能 import json...
  deps: [gameStoreResource.id],
  config: {
    input: gameDatasResource.id,
  },
  info: {
    tags: ['cpbl', 'game'],
    description: '以來自 gameData 的資料建立 mutation',
  },
};

// 必須要有這個
export const NormalizeGameDatas = new PlanResource(
  info as ResourceInfo<PlanMetadata>,
  entry
);