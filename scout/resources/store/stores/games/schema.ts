import { z } from 'zod';
import * as Types from '#shared/utils/types';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import type { Game } from '#shared/model/game';
import {
  fsTimestampSchemaInput,
  fsTimestampSchemaOutput,
} from '#shared/external/firestore';
import { gameSchema } from '#resources/schema/schemas/game';

// 在 firebase 的資料稱作 Document，單純的資料稱作 Store，用命名作出區隔
export type GameStore = Game; // 目前一樣
export type GameDocInput = Types.ToFirestoreDocInput<Game>;
export type GameDocOutput = Types.ToFirestoreDocOutput<Game>;

export const gameStoreSchema = z.object({
  ...gameSchema.shape,
}) satisfies SchemaFromInterface<GameStore>;

export const gameDocInputSchema = z.object({
  id: gameStoreSchema.shape['id'],
  year: gameStoreSchema.shape['year'],
  home_team_code: gameStoreSchema.shape['homeTeamCode'],
  visiting_team_code: gameStoreSchema.shape['visitingTeamCode'],
  kind: gameStoreSchema.shape['kind'],
  season: gameStoreSchema.shape['season'],
  series_no: gameStoreSchema.shape['seriesNo'],
  plays: gameStoreSchema.shape['plays'],
  level: gameStoreSchema.shape['level'],
  source: gameStoreSchema.shape['source'],
  created_at: fsTimestampSchemaInput,
  updated_at: fsTimestampSchemaInput,
}) satisfies SchemaFromInterface<GameDocInput>;

export const gameDocOutputSchema = z.object({
  
  id: gameDocInputSchema.shape['id'],
  year: gameDocInputSchema.shape['year'],
  home_team_code: gameDocInputSchema.shape['home_team_code'].default(null),
  visiting_team_code: gameDocInputSchema.shape['visiting_team_code'].default(null),
  kind: gameDocInputSchema.shape['kind'],
  season: gameDocInputSchema.shape['season'],
  series_no: gameDocInputSchema.shape['series_no'],
  plays: gameDocInputSchema.shape['plays'].default([]),
  level: gameDocInputSchema.shape['level'],
  source: gameDocInputSchema.shape['source'].default({}),

  created_at: fsTimestampSchemaOutput,
  updated_at: fsTimestampSchemaOutput,
}) satisfies SchemaFromInterface<GameDocOutput>;

export const toDoc = (
  gameStore: GameStore,
  {
    createdAt,
    updatedAt,
  }: {
    createdAt: GameDocInput['created_at'];
    updatedAt: GameDocInput['updated_at'];
  }
): GameDocInput => {
  const validDoc = gameDocInputSchema.parse({
    id: gameStore['id'],
    year: gameStore['year'],
    home_team_code: gameStore['homeTeamCode'],
    visiting_team_code: gameStore['visitingTeamCode'],
    kind: gameStore['kind'],
    season: gameStore['season'],
    series_no: gameStore['seriesNo'],
    plays: gameStore['plays'],
    level: gameStore['level'],
    created_at: createdAt,
    updated_at: updatedAt,
  }, { reportInput: true });

  return validDoc;
};

export const toStore = (gameDoc: GameDocOutput): GameStore => {
  const store = {
    id: gameDoc['id'],
    year: gameDoc['year'],
    homeTeamCode: gameDoc['home_team_code'],
    visitingTeamCode: gameDoc['visiting_team_code'],
    kind: gameDoc['kind'],
    season: gameDoc['season'],
    seriesNo: gameDoc['series_no'],
    plays: gameDoc['plays'],
    level: gameDoc['level'],
  };

  return gameStoreSchema.parse(store, { reportInput: true });
};
