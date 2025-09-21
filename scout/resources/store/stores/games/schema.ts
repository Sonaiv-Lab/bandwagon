import {
  kindCodeSchema,
  gameSeasonSchema,
  teamCodeSchema,
  levelSchema,
} from '@bandwagon/shared/constants';
import { z } from 'zod';
import * as Types from '#shared/utils/types';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import type { Game } from '#shared/model/game';
import {
  fsTimestampSchemaInput,
  fsTimestampSchemaOutput,
} from '#shared/external/firestore';

// 在 firebase 的資料稱作 Document，單純的資料稱作 Store，用命名作出區隔
export type GameStore = Game;
export type GameDoc = Types.ToFirestoreDoc<GameStore>;
export type GameDocJson = Types.ToFirestoreDocJson<GameStore>;

export const gameStoreSchema = z
  .object({
    id: z.string(),
    year: z.string(),
    homeTeamCode: teamCodeSchema,
    visitingTeamCode: teamCodeSchema,
    kind: kindCodeSchema,
    season: gameSeasonSchema,
    level: levelSchema,
    seriesNo: z.int(),
    plays: z.string().array(),
  })
  .required({ id: true }) satisfies SchemaFromInterface<GameStore>;

export const gameDocSchemaDomain = z.object({
  ...gameStoreSchema.shape,
  createdAt: fsTimestampSchemaInput,
  updatedAt: fsTimestampSchemaInput,
}) satisfies SchemaFromInterface<GameDoc>;

export const gameDocSchemaRaw = z.object({
  id: gameDocSchemaDomain.shape['id'],
  year: gameDocSchemaDomain.shape['year'],
  home_team_code: gameDocSchemaDomain.shape['homeTeamCode'],
  visiting_team_code: gameDocSchemaDomain.shape['visitingTeamCode'],
  kind: gameDocSchemaDomain.shape['kind'],
  season: gameDocSchemaDomain.shape['season'],
  series_no: gameDocSchemaDomain.shape['seriesNo'],
  plays: gameDocSchemaDomain.shape['plays'],
  level: gameDocSchemaDomain.shape['level'],
  created_at: fsTimestampSchemaOutput,
  updated_at: fsTimestampSchemaOutput,
});

export const toRaw = (gameDocDomain: z.infer<typeof gameDocSchemaDomain>) => {
  return {
    id: gameDocDomain['id'],
    year: gameDocDomain['year'],
    home_team_code: gameDocDomain['homeTeamCode'],
    visiting_team_code: gameDocDomain['visitingTeamCode'],
    kind: gameDocDomain['kind'],
    season: gameDocDomain['season'],
    series_no: gameDocDomain['seriesNo'],
    plays: gameDocDomain['plays'],
    level: gameDocDomain['level'],
    created_at: gameDocDomain['createdAt'],
    updated_at: gameDocDomain['updatedAt'],
  };
};

export const toDomain = (gameDocRaw: z.infer<typeof gameDocSchemaRaw>) => {
  return {
    id: gameDocRaw['id'],
    year: gameDocRaw['year'],
    homeTeamCode: gameDocRaw['home_team_code'],
    visitingTeamCode: gameDocRaw['visiting_team_code'],
    kind: gameDocRaw['kind'],
    season: gameDocRaw['season'],
    seriesNo: gameDocRaw['series_no'],
    plays: gameDocRaw['plays'],
    level: gameDocRaw['level'],
    createdAt: gameDocRaw['created_at'],
    updatedAt: gameDocRaw['updated_at'],
  };
};
