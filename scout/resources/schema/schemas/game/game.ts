import {
  kindCodeSchema,
  gameSeasonSchema,
  gameResultSchema,
  fieldOptsSchema,
  teamCodeSchema,
  levelSchema,
} from '@bandwagon/shared/constants';
import { z } from 'zod';
import { type SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import * as Types from '#shared/utils/types';
import * as rules from './rules';
import type {
  GamePlaySubset,
  GamePlay,
  HalfInning,
  HalfInningSubset,
  GameSubset,
  GameWithoutPlays,
  Game,
} from '#shared/model/game';

/**
要在 schema 這邊檢查「欄位之間的邏輯」典型例子：
- 時間序關係：startDatetime 必須 < endDatetime
- 欄位相依：兩個欄位必須同時為空或同時有值（例如 A/B 互斥）
- 數值範圍：某個欄位必須落在動態範圍，例如 score 必須小於 maxScore
- 複合驗證
*/

// null 表示還沒開使的資料 => 有些東西

export const inningSchema = z.object({
  id: Types.inningIdSchema,
  inning: z.number(),
  halfInning: z.enum(['t', 'b']),
  // 以上為必填欄位，下面都可以是選填
  offenseTeamCode: teamCodeSchema.nullable(),
  defenseTeamCode: teamCodeSchema.nullable(),
  scoreCount: z.number().nullable(),
  hitCount: z.number().nullable(),
  errorCount: z.number().nullable(),
  startPitchId: z.string().nullable(),
  endPitchId: z.string().nullable(),

  // 原資料的來源，基本上 Record<string, string> 都行？
  source: z.record(z.string(), z.string()),
}) satisfies SchemaFromInterface<HalfInning>;

const inningSchemaWithDefault = z.object({
  id: inningSchema.shape.id,
  inning: inningSchema.shape.inning,
  halfInning: inningSchema.shape.halfInning,
  offenseTeamCode: inningSchema.shape.offenseTeamCode.default(null),
  defenseTeamCode: inningSchema.shape.defenseTeamCode.default(null),
  scoreCount: inningSchema.shape.scoreCount.default(null),
  hitCount: inningSchema.shape.hitCount.default(null),
  errorCount: inningSchema.shape.errorCount.default(null),
  startPitchId: inningSchema.shape.startPitchId.default(null),
  endPitchId: inningSchema.shape.endPitchId.default(null),

  source: inningSchema.shape.source.default({}),
}) satisfies SchemaFromInterface<HalfInning>;

const dtStrSchema = Types.datetimeStringSchema;

export const gamePlaySchema = z.object({
  // 基本資訊
  gameId: Types.gameIdSchema,
  id: Types.gamePlayIdSchema,
  field: fieldOptsSchema,
  startDatetime: dtStrSchema,
  endDatetime: dtStrSchema.nullable(),

  // 比賽狀態
  isGameStop: z.boolean(),
  isPlayBall: z.boolean(),
  result: gameResultSchema,
  durationSeconds: Types.durationSecondsSchema,
  homeScore: Types.scoreSchema.nullable(),
  visitingScore: Types.scoreSchema.nullable(),
  reserveDate: dtStrSchema.nullable(),
  // 還沒統計會是 null
  audienceCount: Types.countNumSchema.nullable(),

  // 球員資訊
  visitingPitcherId: Types.cpblPlayerIdSchema.nullable(),
  visitingPitcherName: Types.nameSchema.nullable(),
  homePitcherId: Types.cpblPlayerIdSchema.nullable(),
  homePitcherName: Types.nameSchema.nullable(),
  winningPitcherId: Types.cpblPlayerIdSchema.nullable(),
  winningPitcherName: Types.nameSchema.nullable(),
  loserPitcherId: Types.cpblPlayerIdSchema.nullable(),
  loserPitcherName: Types.nameSchema.nullable(),
  closerId: Types.cpblPlayerIdSchema.nullable(),
  closerName: Types.nameSchema.nullable(),
  winningRbiHitterId: Types.cpblPlayerIdSchema.nullable(),

  // MVP 資訊
  mvpPlayerId: Types.cpblPlayerIdSchema.nullable(),
  mvpPlayerName: Types.nameSchema.nullable(),
  mvpCount: Types.countNumSchema.nullable(),
  mvpAbCount: Types.countNumSchema.nullable(),
  mvpRbiCount: Types.countNumSchema.nullable(),
  mvpRunCount: Types.countNumSchema.nullable(),
  mvpHomeRunCount: Types.countNumSchema.nullable(),
  mvpHitCount: Types.countNumSchema.nullable(),
  // 投手三振次數
  mvpKCount: Types.countNumSchema.nullable(),
  mvpRaCount: Types.countNumSchema.nullable(),
  mvpOutsPitchedCount: Types.countNumSchema.nullable(),
  mvpIsVisitingTeam: z.boolean().nullable(),

  // 裁判
  umpireHp: Types.nameSchema.nullable(),
  umpire1b: Types.nameSchema.nullable(),
  umpire2b: Types.nameSchema.nullable(),
  umpire3b: Types.nameSchema.nullable(),
  umpireLf: Types.nameSchema.nullable(),
  umpireRf: Types.nameSchema.nullable(),

  // 局數顯示，用在 scoreboard
  halfInnings: z.array(inningSchema),

  source: z.record(z.string(), z.string()),
}) satisfies SchemaFromInterface<GamePlay>;

const gamePlaySchemaWithDefault = z.object({
  // 基本資訊
  gameId: gamePlaySchema.shape.gameId,
  id: gamePlaySchema.shape.id,
  field: gamePlaySchema.shape.field.default(''),
  startDatetime: gamePlaySchema.shape.startDatetime,
  endDatetime: gamePlaySchema.shape.endDatetime.default(null),

  // 比賽狀態
  isGameStop: gamePlaySchema.shape.isGameStop.default(false),
  isPlayBall: gamePlaySchema.shape.isPlayBall.default(false),
  result: gamePlaySchema.shape.result.default('pending'),
  durationSeconds: gamePlaySchema.shape.durationSeconds.default(0),
  homeScore: gamePlaySchema.shape.homeScore.default(null),
  visitingScore: gamePlaySchema.shape.visitingScore.default(null),
  reserveDate: gamePlaySchema.shape.reserveDate.default(null),
  audienceCount: gamePlaySchema.shape.audienceCount.default(null),

  // 球員資訊
  visitingPitcherId: gamePlaySchema.shape.visitingPitcherId.default(null),
  visitingPitcherName: gamePlaySchema.shape.visitingPitcherName.default(null),
  homePitcherId: gamePlaySchema.shape.homePitcherId.default(null),
  homePitcherName: gamePlaySchema.shape.homePitcherName.default(null),
  winningPitcherId: gamePlaySchema.shape.winningPitcherId.default(null),
  winningPitcherName: gamePlaySchema.shape.winningPitcherName.default(null),
  loserPitcherId: gamePlaySchema.shape.loserPitcherId.default(null),
  loserPitcherName: gamePlaySchema.shape.loserPitcherName.default(null),
  closerId: gamePlaySchema.shape.closerId.default(null),
  closerName: gamePlaySchema.shape.closerName.default(null),
  winningRbiHitterId: gamePlaySchema.shape.winningRbiHitterId.default(null),

  // MVP 資訊
  mvpPlayerId: gamePlaySchema.shape.mvpPlayerId.default(null),
  mvpPlayerName: gamePlaySchema.shape.mvpPlayerName.default(null),
  mvpCount: gamePlaySchema.shape.mvpCount.default(null),
  mvpAbCount: gamePlaySchema.shape.mvpAbCount.default(null),
  mvpRbiCount: gamePlaySchema.shape.mvpRbiCount.default(null),
  mvpRunCount: gamePlaySchema.shape.mvpRunCount.default(null),
  mvpHomeRunCount: gamePlaySchema.shape.mvpHomeRunCount.default(null),
  mvpHitCount: gamePlaySchema.shape.mvpHitCount.default(null),
  // 投手三振次數
  mvpKCount: gamePlaySchema.shape.mvpKCount.default(null),
  mvpRaCount: gamePlaySchema.shape.mvpRaCount.default(null),
  mvpOutsPitchedCount: gamePlaySchema.shape.mvpOutsPitchedCount.default(null),
  mvpIsVisitingTeam: gamePlaySchema.shape.mvpIsVisitingTeam.default(null),

  // 裁判
  umpireHp: gamePlaySchema.shape.umpireHp.default(null),
  umpire1b: gamePlaySchema.shape.umpire1b.default(null),
  umpire2b: gamePlaySchema.shape.umpire2b.default(null),
  umpire3b: gamePlaySchema.shape.umpire3b.default(null),
  umpireLf: gamePlaySchema.shape.umpireLf.default(null),
  umpireRf: gamePlaySchema.shape.umpireRf.default(null),

  // 局數顯示，用在 scoreboard
  halfInnings: z.array(inningSchemaWithDefault).default([]),

  source: gamePlaySchema.shape.source.default({}),
}) satisfies SchemaFromInterface<GamePlay>;

export const createGamePlay = (gamePlayInput: GamePlaySubset): GamePlay => {
  const validGamePlayInput = gamePlaySchemaWithDefault
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

export const createHalfInning = (
  halfInningInfo: HalfInningSubset
): HalfInning => {
  const validHalfInning = inningSchemaWithDefault.parse(halfInningInfo, {
    reportInput: true,
    error: (issue) => {
      return {
        ...issue,
        message: `schema::inningSchemaWithDefault: ${issue.message}`,
      };
    },
  });

  return validHalfInning;
};

export const gameSchema = z
  .object({
    id: Types.gameIdSchema,
    seriesNo: z.int(),
    year: z.string().length(4),
    homeTeamCode: teamCodeSchema.nullable(),
    visitingTeamCode: teamCodeSchema.nullable(),
    kind: kindCodeSchema,
    season: gameSeasonSchema,
    plays: z.array(Types.gamePlayIdSchema),
    level: levelSchema,
    source: z.record(z.string(), z.string()).catch({}),
  })
  .required() satisfies SchemaFromInterface<Game>;

export const gameSchemaWithDefault = z
  .object({
    id: gameSchema.shape.id,
    seriesNo: gameSchema.shape.seriesNo,
    year: gameSchema.shape.year,
    homeTeamCode: gameSchema.shape.homeTeamCode.default(null),
    visitingTeamCode: gameSchema.shape.visitingTeamCode.default(null),
    kind: gameSchema.shape.kind,
    season: gameSchema.shape.season,
    plays: gameSchema.shape.plays.default([]),
    level: gameSchema.shape.level,
    source: gameSchema.shape.source.default({}),
  })
  .required() satisfies SchemaFromInterface<Game>;

export const createGame = (gameInfo: GameSubset): GameWithoutPlays => {
  const validGameInfo = gameSchemaWithDefault.parse(gameInfo, {
    reportInput: true,
    error: (issue) => {
      return { ...issue, message: `schema::createGameInfo: ${issue.message}` };
    },
  });

  return validGameInfo;
};
