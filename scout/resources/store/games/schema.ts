import {
  kindCodeSchema,
  gameSeasonSchema,
  gameResultValueSchema,
  fieldOptsSchema,
  teamCodeSchema,
  levelSchema,
} from '@bandwagon/shared/constants';
import { z } from 'zod';
import { Timestamp } from '@google-cloud/firestore';
import * as Types from '#shared/utils/types';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import type { GamePlay, Game } from '#shared/model/game';

export type GamePlayStore = Types.ToFirestoreDocument<GamePlay>;

// 只有真正在 firebase 存成 document 的，才叫作「Document」
export type GameDocument = Types.ToFirestoreDocument<Game>;

export const gamePlayStoreSchema = z.object({
  id: z.string(),
  isGameStop: z.boolean(),
  // 是不是正在比賽
  isPlayBall: z.boolean(),
  startDatetime: Types.firestoreTimestampSchema,
  endDatetime: Types.firestoreTimestampSchema.nullable(),
  durationSeconds: Types.durationSecondsSchema,
  field: fieldOptsSchema,
  result: gameResultValueSchema,
  homeScore: Types.scoreSchema,
  visitingScore: Types.scoreSchema,
  reserveDate: Types.firestoreTimestampSchema.nullable(),
  visitingPitcherId: z.string(),
  visitingPitcherName: z.string(),
  homePitcherId: z.string(),
  homePitcherName: z.string(),
  winningPitcherId: z.string(),
  winningPitcherName: z.string(),
  loserPitcherId: z.string(),
  loserPitcherName: z.string(),
  closerId: z.string(),
  closerName: z.string(),
  createdAt: Types.firestoreTimestampSchema,
  updatedAt: Types.firestoreTimestampSchema,
}) satisfies SchemaFromInterface<GamePlayStore>;

export const gameDocumentSchema = z.object({
  id: z.string(),
  gameNo: z.int(),
  year: z.string(),
  // 外面先有一層，裡面保險起見有留一層，雖然我不知道會不會有季中改名的可能
  homeTeamCode: teamCodeSchema,
  visitingTeamCode: teamCodeSchema,
  kind: kindCodeSchema,
  season: gameSeasonSchema,
  level: levelSchema,
  seriesNo: z.int(),
  mvpPlayerId: z.string(),
  mvpPlayerName: z.string(),
  mvpCount: z.int().nullable(),
  plays: gamePlayStoreSchema.array(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
}) satisfies SchemaFromInterface<GameDocument>;
