import { z } from 'zod';
import { kindCodeSchema as KindCodeScheme } from '@bandwagon/shared/constants/kindCode';
import { FieldScheme } from '@bandwagon/shared/constants/fieldOpts';
import {
  teamCodeSchema,
  teamFullNamesSchema,
} from '@bandwagon/shared/constants/teams';
import * as Types from '#shared/utils/types';

const PlayerId = z
  .string()
  .regex(/\d{10}/)
  .or(z.literal(''));

const PlayerName = z.string().or(z.literal(''));
const ImagePath = z.string();
const Date = z.iso.datetime({ local: true });
const NullableDate = Date.nullable();



const gameDataSchema = z.object({
  PresentStatus: z.literal(1).or(z.literal(0)),
  IsGameStop: z.enum(['0', '1']),
  GameDateTimeS: Date,
  GameDateTimeE: NullableDate,
  GameDuringTime: z
    .string()
    .regex(/[\d+\s]/)
    .length(6)
    .or(z.literal('')),
  // HHMMSS
  MultyGame: z.enum(['N', '']),
  // 不知道什麼意思
  Year: z.string().regex(/\d+/).length(4),
  // YYYY
  KindCode: KindCodeScheme,
  GameSeasonCode: z.enum(['1', '2']),
  // '1' 或者 '2'， '1' 代表上半季，'2' 代表下半季
  GameSno: z.number(),
  GameDate: Date,
  // 2024-05-21T18:35:00
  GameResult: Types.gameResultSchema,

  PreExeDate: Date,
  // 不知道什麼意思，目前都跟 GameDate 一樣
  VisitingTeamCode: teamCodeSchema,
  VisitingTeamName: teamFullNamesSchema,
  HomeTeamCode: teamCodeSchema,
  HomeTeamName: teamFullNamesSchema,
  FieldAbbe: FieldScheme,
  VisitingScore: z.number(),
  HomeScore: z.number(),
  MvpAcnt: PlayerId,
  MvpCount: z.number().gt(0).nullable(),
  VisitingPitcherAcnt: PlayerId,
  HomePitcherAcnt: PlayerId,
  WinningPitcherAcnt: PlayerId,
  LoserPitcherAcnt: PlayerId,
  CloserAcnt: PlayerId,
  VisitingClubSmallImgPath: ImagePath,
  HomeClubSmallImgPath: ImagePath,
  WinningPitcherName: PlayerName,
  LoserPitcherName: PlayerName,
  CloserName: PlayerName,
  MvpName: PlayerName,
  VisitingPitcherName: PlayerName,
  HomePitcherName: PlayerName,
  // 是不是正在進行
  IsPlayBall: z.literal('N').or(z.literal('Y')),
  ReserveDate: NullableDate,
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
