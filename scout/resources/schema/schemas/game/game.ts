import {
  kindCodeSchema,
  gameSeasonSchema,
  gameResultSchema,
  fieldOptsSchema,
  teamCodeSchema,
  levelSchema,
} from '@bandwagon/shared/constants';
import { z, ZodOptional } from 'zod';
import { type SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import * as Types from '#shared/utils/types';
import * as rules from './rules';
import type { GameInfo, GamePlaySubset } from '#shared/model/game';

/**
要在 schema 這邊檢查「欄位之間的邏輯」典型例子：
- 時間序關係：startDatetime 必須 < endDatetime
- 欄位相依：兩個欄位必須同時為空或同時有值（例如 A/B 互斥）
- 數值範圍：某個欄位必須落在動態範圍，例如 score 必須小於 maxScore
- 複合驗證
*/

const dtStrSchema = Types.datetimeStringSchema;

const gamePlaySchema = z.object({
  gameId: Types.gameIdSchema,
  id: Types.gamePlayIdSchema,
  isGameStop: z.boolean().catch(false),
  // 是不是正在比賽
  isPlayBall: z.boolean().catch(false),
  startDatetime: dtStrSchema,
  endDatetime: dtStrSchema.nullish(),
  durationSeconds: Types.durationSecondsSchema,
  field: fieldOptsSchema.optional(),
  result: gameResultSchema.optional(),
  homeScore: Types.scoreSchema.catch(0),
  visitingScore: Types.scoreSchema.catch(0),
  reserveDate: dtStrSchema.nullish(),
  visitingPitcherId: Types.cpblPlayerIdSchema.nullish(),
  visitingPitcherName: Types.nameSchema.nullish(),
  homePitcherId: Types.cpblPlayerIdSchema.nullish(),
  homePitcherName: Types.nameSchema.nullish(),
  winningPitcherId: Types.cpblPlayerIdSchema.nullish(),
  winningPitcherName: Types.nameSchema.nullish(),
  loserPitcherId: Types.cpblPlayerIdSchema.nullish(),
  loserPitcherName: Types.nameSchema.nullish(),
  closerId: Types.cpblPlayerIdSchema.nullish(),
  closerName: Types.nameSchema.nullish(),
  mvpPlayerId: Types.cpblPlayerIdSchema.nullish(),
  mvpPlayerName: Types.nameSchema.nullish(),
  mvpCount: Types.countNumSchema.nullish(),
  winningRbiHitterId: Types.cpblPlayerIdSchema.nullish(),
  mvpAbCount: Types.countNumSchema.nullish(),
  mvpRbiCount: Types.countNumSchema.nullish(),
  mvpRunCount: Types.countNumSchema.nullish(),
  mvpHomeRunCount: Types.countNumSchema.nullish(),
  mvpHitCount: Types.countNumSchema.nullish(),
  // 投手三振次數
  mvpKCount: Types.countNumSchema.nullish(),
  mvpRaCount: Types.countNumSchema.nullish(),
  mvpOutsPitchedCount: Types.countNumSchema.nullish(),
  mvpIsVisitingTeam: z.boolean().nullish(),
  umpireHP: Types.nameSchema.nullish(),
  umpire1B: Types.nameSchema.nullish(),
  umpire2B: Types.nameSchema.nullish(),
  umpire3B: Types.nameSchema.nullish(),
  umpireLF: Types.nameSchema.nullish(),
  umpireRF: Types.nameSchema.nullish(),

  // 還沒統計會是 null
  audienceCount: Types.countNumSchema.nullish(),
}) satisfies SchemaFromInterface<GamePlaySubset>;

export const createGamePlayInfo = (
  gamePlayInput: GamePlaySubset
): GamePlaySubset => {
  const validGamePlayInput = gamePlaySchema
    .refine(...rules.datetimeOrder)
    .refine(...rules.pendingEndDatetime)
    .refine(...rules.pendingScore)
    .refine(...rules.checkPlayerRelatedFieldWithGameResult)
    .parse(gamePlayInput, {
      reportInput: true,
      error: (issue) => {
        return {
          ...issue,
          message: `schema::gamePlaySchema: ${issue.message}`,
        };
      },
    });

  return validGamePlayInput;
};

const gameInfoSchema = z
  .object({
    seriesNo: z.int(),
    year: z.string().length(4),
    homeTeamCode: teamCodeSchema,
    visitingTeamCode: teamCodeSchema,
    kind: kindCodeSchema,
    season: gameSeasonSchema,
    level: levelSchema,
  })
  .required() satisfies SchemaFromInterface<GameInfo>;

export const createGameInfo = (gameInfo: GameInfo): GameInfo => {
  const validGameInfo = gameInfoSchema.parse(gameInfo, {
    reportInput: true,
    error: (issue) => {
      return { ...issue, message: `schema::createGameInfo: ${issue.message}` };
    },
  });

  return validGameInfo;
};
