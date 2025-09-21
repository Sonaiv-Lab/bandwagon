import { PlanMetadata } from '../../plan';
// @resource(entry) import
// @resource(json)
import { metadata as gameStoreResource } from '#resources/store/stores/games/games.resource';

// metadata 不能有任何 external reference
export const metadata: PlanMetadata = {
  type: 'plan',
  name: 'game',
  version: '0.0.1',
  // 只能 import json...
  // deps: [gameStoreResource.id],
  deps: [],
  config: {
    collections: {
      game: gameStoreResource.config.collectionName,
    },
  },
  info: {
    tags: ['cpbl', 'game'],
    description: '建立 game store 的 mutation',
  },
};

// 先暫時不用 resource，之後規劃
// export const PlanGameMutation = new PlanResource(
//   info as ResourceInfo<PlanMetadata>,
//   entry
// );
