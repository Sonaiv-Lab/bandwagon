import type {
  KindCodeValue,
  GameSeasonValue,
  LevelValue,
  TeamCodeValue,
  FieldOptsValue,
  GameResult,
} from '@bandwagon/shared/constants';

import * as Types from '#shared/utils/types';

type PitchId = string;

type HalfInning = {
  id: Types.InningId;
  inning: number;
  halfInning: 't' | 'b';
  // 以上為必填欄位，下面都可以是選填

  teamCode: TeamCodeValue | null;
  isVisitingTeam: boolean | null;
  scoreCount: number | null;
  hitCount: number | null;
  errorCount: number | null;
  startPitchId: PitchId;
  endPitchId: PitchId;

  // 原資料的來源，基本上 Record<string, string> 都行？
  source: Record<string, string>;
  // 目前預計填入下面的欄位 ScoreboardJson => 
  /**
    MainEventNoS: string;
    SubEventNoS: string;
    MainEventNoE: string;
    SubEventNoE: string;
  */
};

// 這裡的東西應該都要可以序列化？

// 這裡基本和 shared/modules/game.ts 一樣，但是還沒想好怎麼抽象，為了不影響舊有的 code，先多寫一份

/**
 * GamePlay 指的是「實際比賽的場次」，因為可能會延賽、保留等。所以一場比賽，可能會實際打多個場次
 */
export type GamePlay = {
  // 基本資訊
  gameId: Types.GameId;
  id: Types.GamePlayId;
  field: FieldOptsValue;
  startDatetime: Types.DatetimeString;
  endDatetime: Types.NullableDatetimeString;

  // 比賽狀態
  isGameStop: boolean;
  isPlayBall: boolean;
  result: GameResult;
  durationSeconds: number;
  homeScore: number;
  visitingScore: number;
  reserveDate: Types.NullableDatetimeString;
  // 還沒統計會是 null
  audienceCount: number | null;

  // 球員資訊
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
  winningRbiHitterId: Types.PlayerId | null;

  // MVP 資訊
  mvpPlayerId: Types.PlayerId | null;
  mvpPlayerName: string | null;
  mvpCount: number | null;
  mvpAbCount: number | null;
  mvpRbiCount: number | null;
  mvpRunCount: number | null;
  mvpHitCount: number | null;
  mvpHomeRunCount: number | null;
  // 投手三振次數
  mvpKCount: number | null;
  mvpRaCount: number | null;
  mvpOutsPitchedCount: number | null;
  mvpIsVisitingTeam: boolean | null;

  // 裁判
  umpireHp: string | null;
  umpire1b: string | null;
  umpire2b: string | null;
  umpire3b: string | null;
  umpireLf: string | null;
  umpireRf: string | null;

  // 局數顯示，用在 scoreboard
  halfInnings: HalfInning[];
};

// subset 意味著，如果要作 update，這會是最基本需要的資料，留這些資料的原因是這些資訊才能夠最基本的對到一個 game 的 entity
export type GamePlaySubset = Partial<GamePlay> &
  Pick<GamePlay, 'id' | 'gameId' | 'startDatetime'>;

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
  plays: Types.GamePlayId[];
  level: LevelValue;
};

export type GameInfo = Omit<Game, 'plays' | 'id'>;

export type GamePlayInfo = Omit<GamePlay, 'id' | 'gameId'>;
