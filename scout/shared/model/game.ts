import type {
  KindCodeValue,
  GameSeasonValue,
  LevelValue,
  TeamCodeValue,
  FieldOptsValue,
  GameResultValue,
} from '@bandwagon/shared/constants';

import * as Types from '#shared/utils/types';

// 這裡的東西應該都要可以序列化？

// 這裡基本和 shared/modules/game.ts 一樣，但是還沒想好怎麼抽象，為了不影響舊有的 code，先多寫一份

/**
 * GamePlay 指的是「實際比賽的場次」，因為可能會延賽、保留等。所以一場比賽，可能會實際打多個場次
 */
export type GamePlay = {
  id: Types.GamePlayId;
  isGameStop: boolean;
  // 是不是正在比賽
  isPlayBall: boolean;
  startDatetime: Types.DatetimeString;
  endDatetime: Types.NullableDatetimeString;
  durationSeconds: number;
  field: FieldOptsValue;
  result: GameResultValue;
  homeScore: number;
  visitingScore: number;
  reserveDate: Types.NullableDatetimeString;
  visitingPitcherId: Types.PlayerId | null;
  visitingPitcherName: string | null;
  homePitcherId: Types.PlayerId | null;
  homePitcherName: string | null;
  winningPitcherId: Types.PlayerId | null;
  winningPitcherName: string | null;
  loserPitcherId: Types.PlayerId | null;
  loserPitcherName: string | null;
  closerId: Types.PlayerId | null;
  closerName: string | null;
  mvpPlayerId: Types.PlayerId | null;
  mvpPlayerName: string | null;
  mvpCount: number | null;
};

// 比賽的資訊，對到唯一的 gameId (CPBL 就是 GameNo + year)
export type Game = {
  id: Types.GameId;
  year: Types.Year;
  // 外面先有一層，裡面保險起見有留一層，雖然我不知道會不會有季中改名的可能
  homeTeamCode: TeamCodeValue;
  visitingTeamCode: TeamCodeValue;
  kind: KindCodeValue;
  season: GameSeasonValue;
  seriesNo: number;
  plays: GamePlay[];
  level: LevelValue;
};

export type GameInfo = Omit<Game, 'plays' | 'id'>;

export type GamePlayInfo = Omit<GamePlay, 'id'>
