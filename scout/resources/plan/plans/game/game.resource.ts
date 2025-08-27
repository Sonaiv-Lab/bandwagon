import { Resource, ResourceInfo } from '#shared/resource';
import { PlanMetadata, PlanResource } from '../../plan';
// @resource(entry) import
import * as entry from './game';
// @resource(json)
import gameStoreResource from '#resources/store/stores/games/games.resource.json';

import info from './game.resource.json';

// metadata 不能有任何 external reference
export const metadata: PlanMetadata = {
  type: 'plan',
  name: 'game',
  version: '0.0.1',
  // 只能 import json...
  deps: [gameStoreResource.id],
  config: {
    collections: {
      game: gameStoreResource.metadata.config.collectionName,
    },
  },
  info: {
    tags: ['cpbl', 'game'],
    description: '建立 game store 的 mutation',
  },
};

// 必須要有這個
export const PlanGameMutation = new PlanResource(
  info as ResourceInfo<PlanMetadata>,
  entry
);
