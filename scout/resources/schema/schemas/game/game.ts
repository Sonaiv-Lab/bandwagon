import {
  kindCodeSchema,
  gameSeasonSchema,
  gameResultValueSchema,
  fieldOptsSchema,
  teamCodeSchema,
  levelSchema,
} from '@bandwagon/shared/constants';
import { z } from 'zod';
import { type SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import * as Types from '#shared/utils/types';
import * as GamePlayRules from './rules/gamePlay';
import type { GameInfo, GamePlayInfo } from '#shared/model/game';

/**
要在 schema 這邊檢查「欄位之間的邏輯」典型例子：
- 時間序關係：startDatetime 必須 < endDatetime
- 欄位相依：兩個欄位必須同時為空或同時有值（例如 A/B 互斥）
- 數值範圍：某個欄位必須落在動態範圍，例如 score 必須小於 maxScore
- 複合驗證
*/


const dtStrSchema = Types.datetimeStringSchema;

const gamePlaySchema = z
  .object({
    isGameStop: z.boolean(),
    // 是不是正在比賽
    isPlayBall: z.boolean(),
    startDatetime: dtStrSchema,
    endDatetime: dtStrSchema.nullable(),
    durationSeconds: Types.durationSecondsSchema,
    field: fieldOptsSchema,
    result: gameResultValueSchema,
    homeScore: Types.scoreSchema,
    visitingScore: Types.scoreSchema,
    reserveDate: dtStrSchema.nullable(),
    visitingPitcherId: Types.cpblPlayerIdSchema.nullable(),
    visitingPitcherName: Types.cpblPlayerNameSchema.nullable(),
    homePitcherId: Types.cpblPlayerIdSchema.nullable(),
    homePitcherName:Types.cpblPlayerNameSchema.nullable(),
    winningPitcherId: Types.cpblPlayerIdSchema.nullable(),
    winningPitcherName:Types.cpblPlayerNameSchema.nullable(),
    loserPitcherId: Types.cpblPlayerIdSchema.nullable(),
    loserPitcherName:Types.cpblPlayerNameSchema.nullable(),
    closerId: Types.cpblPlayerIdSchema.nullable(),
    closerName:Types.cpblPlayerNameSchema.nullable(),
    mvpPlayerId: Types.cpblPlayerIdSchema.nullable(),
    mvpPlayerName:Types.cpblPlayerNameSchema.nullable(),
    mvpCount: z.int().nullable(),
  })
  .required() satisfies SchemaFromInterface<GamePlayInfo>;

export const createGamePlayInfo = (
  gamePlayInput: GamePlayInfo
): GamePlayInfo => {
  const validGamePlayInput = gamePlaySchema
    .refine(...GamePlayRules.datetimeOrder)
    .refine(...GamePlayRules.pendingEndDatetime)
    .refine(...GamePlayRules.pendingScore)
    .refine(...GamePlayRules.checkPlayerRelatedFieldWithGameResult)
    .parse(gamePlayInput, {
      reportInput: true,
      error: (issue) => {
        return {
          ...issue,
          message: `schema::createGamePlayInfo: ${issue.message}`,
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
