import { Year, MonthString, DateYYYY_MM_DD, ISODateTimeString } from '../types';
import { FieldOpts } from '../constants/fieldOpts';
import { GameSeason, Result } from './game';

export type Calendar = Record<Year, Record<MonthString, DateYYYY_MM_DD[]>>;

export type GameSummary = {
  id: string;
  isPlayBall: boolean,
  startDatetime: ISODateTimeString;
  endDatetime: ISODateTimeString | null;
  year: Year;
  homeTeamName: string;
  homeTeamCode: string;
  homeScore: number;
  visitingTeamName: string;
  visitingScore: number;
  visitingTeamCode: string;
  gameKindCode: string;
  gameSeason: GameSeason;
  gameNo: number;
  result: Result;
  field: FieldOpts;
};

export type DailySchedule = Record<DateYYYY_MM_DD, GameSummary[]>;
