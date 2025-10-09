import { z } from 'zod';
import { kindCodeSchema as KindCodeScheme } from '@bandwagon/shared/constants/kindCode';
import { fieldOptsSchema } from '@bandwagon/shared/constants/fieldOpts';
import { teamCodeSchema } from '@bandwagon/shared/constants/teams';
import * as Types from '#shared/utils/types';

const curtGameDetailJsonSchema = z.object({
  // === MVP 資訊 ===
  MvpAcnt: Types.playerIdFieldSchema,
  MvpVisitingHomeType: Types.visitingHomeFieldSchema,
  // 當年 MVP 的次數
  MvpCnt: Types.nullableCountNumSchema,

  // MVP 為打者的資訊
  HitterAcnt: Types.playerIdFieldSchema,
  // 打數
  HitCnt: Types.nullableCountNumSchema,
  // 打點 RBI
  RunBattedInCnt: Types.nullableCountNumSchema,
  // 得分
  ScoreCnt: Types.nullableCountNumSchema,
  // 安打
  HittingCnt: Types.nullableCountNumSchema,
  // 全壘打
  HomeRunCnt: Types.nullableCountNumSchema,

  // MVP 為投手的資訊
  PitcherAcnt: Types.playerIdFieldSchema,
  // 投幾局
  InningPitchedCnt: Types.nullableCountNumSchema,
  // 投 .幾個人次
  InningPitchedDiv3Cnt: Types.nullableCountNumSchema,
  // 三振次數
  StrikeOutCnt: Types.nullableCountNumSchema,
  // 失分數
  RunCnt: Types.nullableCountNumSchema,

  // === 比賽資訊 ===
  FieldNo: fieldOptsSchema,
  GameDateTimeS: Types.gameDateFieldSchema,
  GameDateTimeE: Types.nullableGameDateFieldSchema,
  GameDate: Types.gameDateFieldSchema,
  GameDuringTime: Types.gameDuringTimeFieldSchema,
  IsGameStop: z.enum(['0', '1']),
  Year: Types.yearStrSchema,
  KindCode: KindCodeScheme,
  GameSeasonCode: Types.gameSeasonSchema,
  GameSno: z.number(),
  GameResult: Types.gameResultSchema,
  VisitingTeamCode: teamCodeSchema,
  HomeTeamCode: teamCodeSchema,
  // 觀眾數量
  AudienceCnt: z.number(),
  // 好像是...有沒有滿場？
  IsFull: z.enum(['1', '0']),

  // === 勝負資訊 ===
  VisitingTotalScore: Types.scoreSchema,
  HomeTotalScore: Types.scoreSchema,
  // 勝負投手資訊
  WinningPitcherAcnt: Types.playerIdFieldSchema,
  LosePitcherAcnt: Types.playerIdFieldSchema,
  CloserPitcherAcnt: Types.playerIdFieldSchema,
  // 獲勝隊伍
  WinningType: Types.visitingHomeFieldSchema,
  // 勝利打點
  GameWinningRbiAcnt: Types.playerIdFieldSchema,

  // === 隊伍資訊 ===
  VisitingGameResultWCnt: Types.nullableCountNumSchema,
  VisitingGameResultLCnt: Types.nullableCountNumSchema,
  VisitingGameResultTCnt: Types.nullableCountNumSchema,
  HomeGameResultWCnt: Types.nullableCountNumSchema,
  HomeGameResultLCnt: Types.nullableCountNumSchema,
  HomeGameResultTCnt: Types.nullableCountNumSchema,

  // === 裁判群 ===
  HeadUmpire: Types.nameFieldSchema,
  OneBaseReferee: Types.nameFieldSchema,
  TwoBaseReferee: Types.nameFieldSchema,
  TrheeBaseReferee: Types.nameFieldSchema,
  LeftFieldReferee: Types.nameFieldSchema,
  RightFieldReferee: Types.nameFieldSchema,

  // 會有一些手打的紀錄、技術室人員等，會師ˋ html 格式
  Briefing: z.string(),
});

export type CurtGameDetail = z.infer<typeof curtGameDetailJsonSchema>;

export const validate = (input: unknown) => {
  return curtGameDetailJsonSchema.parse(input, {
    reportInput: true,
    error: (issue) => {
      return {
        ...issue,
        message: `normalize:curtGameDetailJson:validating: ${issue.message}`,
      };
    },
  });
};
