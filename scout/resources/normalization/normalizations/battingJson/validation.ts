import { z } from 'zod';
import * as Schemas from '../../schemas';

const battingSchema = z.object({
  // E
  ErrorCnt: Schemas.countFieldSchema,
  // PA
  TotalHittingCnt: Schemas.countFieldSchema,
  // 安打數
  TotalHitCnt: Schemas.countFieldSchema,
  // 總全壘打
  TotalHomeRunCnt: Schemas.countFieldSchema,
  Year: Schemas.yearFieldSchema,
  KindCode: Schemas.kindCodefieldSchema,
  GameSno: Schemas.seriesNoFieldSchema,
  // 不知道個要幹嘛
  // Seq: '0000000001',
  VisitingHomeType: Schemas.visitingHomeFieldSchema,
  HitterAcnt: Schemas.playerIdFieldSchema,
  HitterName: Schemas.nameFieldSchema,
  HitterUniformNo: z.string(),
  // 先發 / 非先發
  RoleType: z.enum(['先發', '非先發']),
  // 這不知道幹麻的
  // "IsContinuousRace": "1",
  // 打席
  PlateAppearances: Schemas.countFieldSchema,
  // 打數
  HitCnt: Schemas.countFieldSchema,
  // 打電數
  RunBattedINCnt: Schemas.countFieldSchema,
  // 勝利打點
  GameWinningRbiCnt: Schemas.countFieldSchema,
  // 是否為 MVP
  IsMvp: Schemas.boolFieldSchema,
  // 得分 (非打點)
  ScoreCnt: Schemas.countFieldSchema,
  // 安打數
  HittingCnt: Schemas.countFieldSchema,
  // 一壘安打
  OneBaseHitCnt: Schemas.countFieldSchema,
  // 二壘安打
  TwoBaseHitCnt: Schemas.countFieldSchema,
  // 三壘安打
  ThreeBaseHitCnt: Schemas.countFieldSchema,
  // 全壘打
  HomeRunCnt: Schemas.countFieldSchema,
  // 滿貫砲
  GrandSlamHomerunCnt: Schemas.countFieldSchema,
  // 總壘打數
  TotalBases: Schemas.countFieldSchema,
  // 雙殺打
  DoublePlayBatCnt: Schemas.countFieldSchema,
  // 三殺打
  TripplePlayBatCnt: Schemas.countFieldSchema,
  // 犧牲觸擊 SH
  SacrificeHitCnt: Schemas.countFieldSchema,
  // 犧牲飛球 SF
  SacrificeFlyCnt: Schemas.countFieldSchema,
  // 保送
  BasesONBallsCnt: Schemas.countFieldSchema,
  // 故意保送 IBB
  IntentionalBasesONBallsCnt: Schemas.countFieldSchema,
  // 被觸身球 HBP
  HitBYPitchCnt: Schemas.countFieldSchema,
  // 被三振 SO
  StrikeOutCnt: Schemas.countFieldSchema,
  // 盜壘成功
  StealBaseOKCnt: Schemas.countFieldSchema,
  // 盜壘刺
  StealBaseFailCnt: Schemas.countFieldSchema,
  // 殘壘數量
  Lobs: 1,
  // ？？？不知道什麼意思
  LeftBehindLobs: Schemas.countFieldSchema,
  // 妨礙跑壘
  ObstructionCnt: Schemas.countFieldSchema,

  // 這裡先不用
  // Pkno: 'Z04EGWCR',
  // CreateTime: '2025-09-28T18:33:58',
  // CreateUser: 'batch',
  // UpdateTime: '2025-09-28T18:33:58',
  // UpdateUser: 'batch',
  // Rowstamp: '',
  // Rboe: 0,
});

export type Batting = z.infer<typeof battingSchema>;

export const battingJsonSchema = z.array(battingSchema);

export const validate = (input: unknown) => {
  return battingJsonSchema.parse(input, {
    reportInput: true,
    error: (issue) => {
      return {
        ...issue,
        message: `normalize:liveLogJson:validating: ${issue.message}`,
      };
    },
  });
};
