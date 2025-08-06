import { z } from 'zod';
import { kindCodeSchema as KindCodeScheme } from '@bandwagon/shared/constants/kindCode';
import {
  fieldOptsSchema,
  FieldScheme,
} from '@bandwagon/shared/constants/fieldOpts';
import {
  teamCodeSchema,
  teamFullNamesSchema,
} from '@bandwagon/shared/constants/teams';

const Body = z
  .object({
    calendar: z.string().regex(/\d\d\d\d\/\d\d\/\d\d/), // YYYY/MM/DD
    location: fieldOptsSchema,
    kindCode: KindCodeScheme,
  })
  .required();

type TBody = z.infer<typeof Body>;

const PlayerId = z
  .string()
  .regex(/\d{10}/)
  .or(z.literal(''));
const PlayerName = z.string().or(z.literal(''));
const ImagePath = z.string();
const Date = z.string().datetime({ local: true });
const NullableDate = Date.nullable();

const GamesData = z.object({
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
  GameResult: z.enum(['', '0', '1', '2']),
  /**
    '0', '1', '2'，
    '': 還沒打
    0: 正常完賽
    1:  代表延賽
    2: 代表保留
    - 保留一定會有 Reserve Date
    - ReserveDate 對應到的比賽
      - PresentStatus = 1
      - GameDateTimeS 會是第一場比賽開始時間
      - 
  */
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

const GamesDatasSchema = z.array(GamesData);

type TGamesDatasSchema = z.infer<typeof GamesDatasSchema>;

type TGamesData = z.infer<typeof GamesData>;

export { GamesDatasSchema, Body };

export type { TGamesDatasSchema, TBody, TGamesData };
