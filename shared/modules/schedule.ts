import { Year, MonthString, DateString, ISODateTimeString } from '../types';
import { FieldOpts } from "../constants/fieldOpts";
import { GameSeason, Result } from './game';

export type Calendar = Record<Year, Record<MonthString, DateString[]>>;

export type GameSummary = {
  id: string;
  startDatetime: ISODateTimeString;
  endDatetime: ISODateTimeString | '';
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

export type DailySchedule = Record<DateString, GameSummary[]>;
