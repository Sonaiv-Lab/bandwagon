import {
  kindCodeSchema,
  gameSeasonSchema,
  gameResultValueSchema,
  fieldOptsSchema,
  teamCodeSchema,
  levelSchema,
} from '@bandwagon/shared/constants';
import { z } from 'zod';
import * as Types from '#shared/utils/types';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import type { GamePlay, Game } from '#shared/model/game';
import { DateTime } from 'luxon';
import {
  Timestamp,
} from '#shared/external/firestore';


// 不轉時間了，會掉時區資訊
export type GamePlayStore = GamePlay;

// 只有真正在 firebase 存成 document 的，才叫作「Document」
export type GameStore = Game;

export type GameDocument = Types.ToFirestoreDoc<GameStore>;

const dtToFSTimestamp = (datetime: Types.DatetimeString) => {
  return Timestamp.fromDate(DateTime.fromISO(datetime).toJSDate());
};

const fsTimestampToDt = (timestamp: Timestamp) => {
  return Types.createDtStrFromDateTime(
    DateTime.fromJSDate(timestamp.toDate()),
    'Asia/Taipei'
  );
};

const gamePlayDataSchema = z.object({
  id: z.string(),
  isGameStop: z.boolean(),
  // 是不是正在比賽
  isPlayBall: z.boolean(),
  startDatetime: Types.datetimeStringSchema,
  endDatetime: Types.datetimeStringSchema.nullable(),
  durationSeconds: Types.durationSecondsSchema,
  field: fieldOptsSchema,
  result: gameResultValueSchema,
  homeScore: Types.scoreSchema,
  visitingScore: Types.scoreSchema,
  reserveDate: Types.datetimeStringSchema.nullable(),
  visitingPitcherId: z.string().nullable(),
  visitingPitcherName: z.string().nullable(),
  homePitcherId: z.string().nullable(),
  homePitcherName: z.string().nullable(),
  winningPitcherId: z.string().nullable(),
  winningPitcherName: z.string().nullable(),
  loserPitcherId: z.string().nullable(),
  loserPitcherName: z.string().nullable(),
  closerId: z.string().nullable(),
  closerName: z.string().nullable(),
  mvpPlayerId: z.string().nullable(),
  mvpPlayerName: z.string().nullable(),
  mvpCount: z.int().nullable(),
}) satisfies SchemaFromInterface<GamePlay>;

export const gameDataSchema = z
  .object({
    id: z.string(),
    year: z.string(),
    // 外面先有一層，裡面保險起見有留一層，雖然我不知道會不會有季中改名的可能
    homeTeamCode: teamCodeSchema,
    visitingTeamCode: teamCodeSchema,
    kind: kindCodeSchema,
    season: gameSeasonSchema,
    level: levelSchema,
    seriesNo: z.int(),
    plays: gamePlayDataSchema.array(),
    // createdAt: z.instanceof(Timestamp),
    // updatedAt: z.instanceof(Timestamp),
  })
  .required({ id: true }) satisfies SchemaFromInterface<GameStore>;

const gamePlayDocSchema = z.object({
  ...gamePlayDataSchema.shape,
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});

const gamePlayDocSchemaTransformed = gamePlayDocSchema.transform((play) => {
  return {
    ...play,
    createdAt: fsTimestampToDt(play.createdAt),
    updatedAt: fsTimestampToDt(play.createdAt),
  };
});

export const gameDocSchema = z.object({
  ...gameDataSchema.shape,
  plays: z.record(z.string().regex(/^\d+$/), gamePlayDocSchema).transform((map) => {
    return Object.values(map);
  }),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
})

export const gameDocSchemaTransformed = gameDocSchema.extend({
  plays: z.record(z.string().regex(/^\d+$/), gamePlayDocSchemaTransformed).transform((map) => {
    return Object.values(map);
  }),
}).transform((game) => {
  return {
    ...game,
    createdAt: fsTimestampToDt(game.createdAt),
    updatedAt: fsTimestampToDt(game.createdAt),
  };
});