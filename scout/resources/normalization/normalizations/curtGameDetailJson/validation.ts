import { z } from 'zod';
import * as Schemas from '../../schemas';

export const curtGameDetailJsonSchema = z.object({
  // === MVP 資訊 ===
  MvpAcnt: Schemas.playerIdFieldSchemaNullable,
  MvpVisitingHomeType: Schemas.visitingHomeFieldSchema,
  // 當年 MVP 的次數
  MvpCnt: Schemas.countFieldSchemaNullable,

  // MVP 為打者的資訊
  HitterAcnt: Schemas.playerIdFieldSchemaNullable,
  // 打數
  HitCnt: Schemas.countFieldSchemaNullable,
  // 打點 RBI
  RunBattedInCnt: Schemas.countFieldSchemaNullable,
  // 得分
  ScoreCnt: Schemas.countFieldSchemaNullable,
  // 安打
  HittingCnt: Schemas.countFieldSchemaNullable,
  // 全壘打
  HomeRunCnt: Schemas.countFieldSchemaNullable,

  // MVP 為投手的資訊
  PitcherAcnt: Schemas.playerIdFieldSchemaNullable,
  // 投幾局
  InningPitchedCnt: Schemas.countFieldSchemaNullable,
  // 投 .幾個人次
  InningPitchedDiv3Cnt: Schemas.countFieldSchemaNullable,
  // 三振次數
  StrikeOutCnt: Schemas.countFieldSchemaNullable,
  // 失分數
  RunCnt: Schemas.countFieldSchemaNullable,

  // === 比賽資訊 ===
  FieldNo: Schemas.fieldNoFieldSchema,
  GameDateTimeS: Schemas.dateFieldSchema,
  GameDateTimeE: Schemas.dateFieldSchemaNullable,
  GameDate: Schemas.dateFieldSchema,
  GameDuringTime: Schemas.gameDuringTimeFieldSchema,
  IsGameStop: Schemas.boolFieldSchema,
  Year: Schemas.yearFieldSchema,
  KindCode: Schemas.kindCodefieldSchema,
  GameSeasonCode: Schemas.gameSeasonFieldSchema,
  GameSno: Schemas.seriesNoFieldSchema,
  GameResult: Schemas.gameResultFieldSchema,
  VisitingTeamCode: Schemas.teamCodeSchema,
  HomeTeamCode: Schemas.teamCodeSchema,
  // 觀眾數量
  AudienceCnt: Schemas.countFieldSchema,
  // 好像是...有沒有滿場？
  IsFull: Schemas.boolFieldSchema,

  // === 勝負資訊 ===
  VisitingTotalScore: Schemas.scoreSchema,
  HomeTotalScore: Schemas.scoreSchema,
  // 勝負投手資訊
  WinningPitcherAcnt: Schemas.playerIdFieldSchemaNullable,
  LosePitcherAcnt: Schemas.playerIdFieldSchemaNullable,
  CloserPitcherAcnt: Schemas.playerIdFieldSchemaNullable,
  // 獲勝隊伍
  WinningType: Schemas.visitingHomeFieldSchema,
  // 勝利打點
  GameWinningRbiAcnt: Schemas.playerIdFieldSchemaNullable,

  // === 隊伍資訊 ===
  VisitingGameResultWCnt: Schemas.countFieldSchemaNullable,
  VisitingGameResultLCnt: Schemas.countFieldSchemaNullable,
  VisitingGameResultTCnt: Schemas.countFieldSchemaNullable,
  HomeGameResultWCnt: Schemas.countFieldSchemaNullable,
  HomeGameResultLCnt: Schemas.countFieldSchemaNullable,
  HomeGameResultTCnt: Schemas.countFieldSchemaNullable,

  // === 裁判群 ===
  HeadUmpire: Schemas.nameFieldSchemaNullable,
  OneBaseReferee: Schemas.nameFieldSchemaNullable,
  TwoBaseReferee: Schemas.nameFieldSchemaNullable,
  TrheeBaseReferee: Schemas.nameFieldSchemaNullable,
  LeftFieldReferee: Schemas.nameFieldSchemaNullable,
  RightFieldReferee: Schemas.nameFieldSchemaNullable,

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
