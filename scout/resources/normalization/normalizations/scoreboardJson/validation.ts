import { z } from 'zod';
import * as Schemas from '../../schemas';

export const scoreboardSchema = z.object({
  // === MVP 資訊 ===
  // TeamName: '台鋼雄鷹',
  // TeamAbbr: '台鋼雄鷹',
  TeamNo: Schemas.teamCodeSchema,
  VisitingHomeType: Schemas.visitingHomeFieldSchema,
  InningSeq: z.number(),
  ScoreCnt: Schemas.countFieldSchema,
  HittingCnt: Schemas.countFieldSchema,
  ErrorCnt: Schemas.countFieldSchema,
  // IsAdmit: '1',
  MainEventNoS: Schemas.eventNoFieldSchemaNullable,
  SubEventNoS: z.string(),
  MainEventNoE: Schemas.eventNoFieldSchemaNullable,
  SubEventNoE: z.string(),
  // Seq: '0000000001',
  Year: Schemas.yearFieldSchema,
  KindCode: Schemas.kindCodefieldSchema,
  GameSeasonCode: Schemas.gameSeasonFieldSchema,
  GameSno: Schemas.seriesNoFieldSchema,
  // 下面都不管他
  // "Pkno": "Z04EGEFE",
  // "CreateTime": "2025-09-28T18:19:20",
  // "CreateUser": "bo138",
  // "UpdateTime": "2025-09-28T18:20:31",
  // "UpdateUser": "bo138",
  // "Rowstamp": ""
});

export type Scoreboard = z.infer<typeof scoreboardSchema>;

export const scoreboardJsonSchema = z.array(scoreboardSchema);

export const validate = (input: unknown) => {
  return scoreboardJsonSchema.parse(input, {
    reportInput: true,
    error: (issue) => {
      return {
        ...issue,
        message: `normalize:scoreboard:validating: ${issue.message}`,
      };
    },
  });
};
