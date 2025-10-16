import { z } from 'zod';
import { FieldScheme } from '@bandwagon/shared/constants/fieldOpts';
import { teamFullNamesSchema } from '@bandwagon/shared/constants/teams';
import * as Schemas from '../../schemas';

export const gameDataSchema = z.object({
  PresentStatus: z.literal(1).or(z.literal(0)),
  IsGameStop: Schemas.boolFieldSchema,
  GameDateTimeS: Schemas.dateFieldSchema,
  GameDateTimeE: Schemas.dateFieldSchemaNullable,
  GameDuringTime: Schemas.gameDuringTimeFieldSchema,
  // HHMMSS
  MultyGame: z.enum(['N', '']),
  // 不知道什麼意思
  Year: Schemas.yearFieldSchema,
  // YYYY
  KindCode: Schemas.kindCodefieldSchema,
  GameSeasonCode: Schemas.gameSeasonFieldSchema,
  // '1' 或者 '2'， '1' 代表上半季，'2' 代表下半季
  GameSno: Schemas.seriesNoFieldSchema,
  GameDate: Schemas.dateFieldSchema,
  // 2024-05-21T18:35:00
  GameResult: Schemas.gameResultFieldSchema,

  PreExeDate: Schemas.dateFieldSchema,
  // 不知道什麼意思，目前都跟 GameDate 一樣
  VisitingTeamCode: Schemas.teamCodeSchema,
  VisitingTeamName: teamFullNamesSchema,
  HomeTeamCode: Schemas.teamCodeSchema,
  HomeTeamName: teamFullNamesSchema,
  FieldAbbe: FieldScheme,
  VisitingScore: Schemas.scoreSchema,
  HomeScore: Schemas.scoreSchema,
  MvpAcnt: Schemas.playerIdFieldSchemaNullable,
  MvpCount: Schemas.countFieldSchema,
  VisitingPitcherAcnt: Schemas.playerIdFieldSchemaNullable,
  HomePitcherAcnt: Schemas.playerIdFieldSchemaNullable,
  WinningPitcherAcnt: Schemas.playerIdFieldSchemaNullable,
  LoserPitcherAcnt: Schemas.playerIdFieldSchemaNullable,
  CloserAcnt: Schemas.playerIdFieldSchemaNullable,
  VisitingClubSmallImgPath: Schemas.urlPathSchema,
  HomeClubSmallImgPath: Schemas.urlPathSchema,
  WinningPitcherName: Schemas.nameFieldSchemaNullable,
  LoserPitcherName: Schemas.nameFieldSchemaNullable,
  CloserName: Schemas.nameFieldSchemaNullable,
  MvpName: Schemas.nameFieldSchemaNullable,
  VisitingPitcherName: Schemas.nameFieldSchemaNullable,
  HomePitcherName: Schemas.nameFieldSchemaNullable,
  // 是不是正在進行
  IsPlayBall: z.enum(['N', 'Y']),
  ReserveDate: Schemas.dateFieldSchemaNullable,
});

export const gamesDatasSchema = z.array(gameDataSchema);

export const validate = (input: unknown) => {
  return gamesDatasSchema.parse(input, {
    reportInput: true,
    error: (issue) => {
      return {
        ...issue,
        message: `normalize:gameData:validating: ${issue.message}`,
      };
    },
  });
};

export type GameData = z.infer<typeof gameDataSchema>;
