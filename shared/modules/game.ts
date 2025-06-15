import { z } from 'zod';
import { Scheme as KindCodeScheme } from '../constants/kindCode';
import { FieldOptsScheme } from '../constants/fieldOpts';
import { teamCodeSchema } from "../constants/teams";

const DatetimeScheme = z.string().datetime({ offset: true });

const CPBLGameId = z.string(); // TODO check with correct id regex
const PlayerId = z.string();
const TeamId = z.string();
const Url = z.string().url();
const gameSeason = z.enum([
  '', // 短期賽，沒有分季
  '0', // 單一賽季
  '1', // 上半季
  '2', // 下半季
]);

export type GameSeason = z.infer<typeof gameSeason>;

const ResultScheme = z.enum([
  'pending', // 未結束,
  'ended', // 結束,
  'postponed', // 延賽,
  'suspended', // 保留比賽
]);

export type Result = z.infer<typeof ResultScheme>;

type LinkResource = {
  type: 'link';
  src: z.infer<typeof Url>;
};

export const GameScheme = z.object({
  id: CPBLGameId,
  gameNo: z.number(),
  year: z.string(),
  gameKindCode: KindCodeScheme,
  gameSeason: gameSeason,
  gameSeriesNo: z.number(),
  isGameStop: z.boolean(),
  startDatetime: DatetimeScheme,
  endDatetime: DatetimeScheme.nullable(),
  durationSeconds: z.number(),
  field: FieldOptsScheme,
  result: ResultScheme,
  homeScore: z.number(),
  visitingScore: z.number(),
  reserveDate: DatetimeScheme.nullable(),
  homeTeamCode: teamCodeSchema,
  homeTeamName: z.string(),
  homeTeamIconUrl: Url,
  visitingTeamCode: teamCodeSchema,
  visitingTeamName: z.string(),
  visitingTeamIconUrl: Url,
  mvpPlayerId: PlayerId.or(z.literal('')),
  mvpPlayerName: z.string(),
  mvpCount: z.number().nullable(),
  visitingPitcherId: PlayerId.or(z.literal('')),
  visitingPitcherName: z.string(),
  homePitcherId: PlayerId.or(z.literal('')),
  homePitcherName: z.string(),
  winningPitcherId: PlayerId,
  winningPitcherName: z.string(),
  loserPitcherId: PlayerId.or(z.literal('')),
  loserPitcherName: z.string(),
  closerId: PlayerId.or(z.literal('')),
  closerName: z.string(),
});

export type Game = z.infer<typeof GameScheme>;
