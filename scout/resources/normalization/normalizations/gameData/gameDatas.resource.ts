import { ResourceInfo } from '#shared/resource';
import {
  NormalizationMetadata,
  NormalizationResource,
} from '../../normalization';
import info from './gameDatas.resource.json';
// @resource(entry)
import entry from './gameDatas';
// @resource(json)
import gameResource from '../../../schema/schemas/game/game.resource.json';

// metadata 不能有任何 external reference
export const metadata: NormalizationMetadata = {
  type: 'normalization',
  name: 'gameDatas',
  version: '0.0.1',
  deps: [gameResource.id],
  config: {
    from: '',
    to: '',
  },
  info: {
    tags: ['cpbl', 'gameDatas'],
    description: '處理來自 getgamedatas 的資料: gameDatas',
  },
};

export const GameSchema = new NormalizationResource(
  info as ResourceInfo<NormalizationMetadata>,
  entry,
);

export * from './gameDatas';
