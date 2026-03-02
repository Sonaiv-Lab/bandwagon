import { ResourceInfo } from '#shared/resource';
import { SchemaMetadata, SchemaResource } from '../../schema';
import info from './game.resource.json';
// @resource(entry)
import entry from './game';


// metadata 不能有任何 external reference
export const metadata: SchemaMetadata = {
  type: 'schema',
  name: 'game',
  version: '0.0.1',
  deps: [],
  config: {},
  info: {
    tags: ['game'],
    description: '處理來自 getgamedatas 的資料: gameDatas',
  },
};

// 必須要有這個
export const GameSchema = new SchemaResource(
  info as ResourceInfo<SchemaMetadata>,
  entry,
);


export * from './game';
