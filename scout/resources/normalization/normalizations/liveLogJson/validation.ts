import { z } from 'zod';
import * as Schemas from '../../schemas';

export const liveLogSchema = z.object({
  DefendStationCode: Schemas.defendStationFieldSchema,
  HitterImgPath: Schemas.urlPathSchema,
  Year: Schemas.yearFieldSchema,
  KindCode: Schemas.kindCodefieldSchema,
  GameSno: z.number(),
  InningSeq: z.number(),
  VisitingHomeType: Schemas.visitingHomeFieldSchema,
  BattingOrder: z.number().positive(),
  Content: z.string(),
  MainEventNo: Schemas.eventNoFieldSchema,
  HitterAcnt: Schemas.playerIdFieldSchema,
  HitterUniformNo: z.string(),
  HitterName: Schemas.nameFieldSchema,
  HitterDefendStation: Schemas.defensePosRecordCodeSchema,
  HitterLineup: z.number().positive(),
  PitcherAcnt: Schemas.playerIdFieldSchema,
  PitcherUniformNo: z.string(),
  PitcherName: Schemas.nameFieldSchema,
  CatcherAcnt: Schemas.playerIdFieldSchema,
  CatcherUniformNo: z.string(),
  CatcherName: Schemas.nameFieldSchema,
  IsStrike: Schemas.boolFieldSchema,
  IsBall: Schemas.boolFieldSchema,
  IsChangePlayer: Schemas.boolFieldSchema,

  // 這裡代表得是壘上的打序是多少
  FirstBase: z.string().regex(/\d/).or(z.string('')),
  SecondBase: z.string().regex(/\d/).or(z.string('')),
  ThirdBase: z.string().regex(/\d/).or(z.string('')),

  StrikeCnt: Schemas.countFieldSchema,
  BallCnt: Schemas.countFieldSchema,
  PitchCnt: Schemas.countFieldSchema,
  OutCnt: Schemas.countFieldSchema,
  ActionName: z.string(),
  BattingActionName: z.string(),
  IsScoreCnt: Schemas.boolFieldSchema,
  VisitingScore: Schemas.countFieldSchema,
  HomeScore: Schemas.countFieldSchema,

  // 這裡先不用
  // "Pkno": "Z04EJV6H",
  // "CreateTime": "2025-09-28T19:52:14",
  // "CreateUser": "system",
  // "UpdateTime": "2025-09-28T19:52:14",
  // "UpdateUser": "system",
  // "Rowstamp": "195214799",
  // "IsSpecialEvent": "0"
});

export type LifeLog = z.infer<typeof liveLogSchema>;

export const liveLogJsonSchema = z.array(liveLogSchema);

export const validate = (input: unknown) => {
  return liveLogJsonSchema.parse(input, {
    reportInput: true,
    error: (issue) => {
      return {
        ...issue,
        message: `normalize:liveLogJson:validating: ${issue.message}`,
      };
    },
  });
};
