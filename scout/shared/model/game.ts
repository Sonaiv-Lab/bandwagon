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

export type HalfInning = {
  id: Types.InningId;
  inningNo: number;
  // 上半局 / 下半局
  halfInning: 't' | 'b';
  // 以上為必填欄位，下面都可以是選填

  offenseTeamCode: TeamCodeValue | null;
  defenseTeamCode: TeamCodeValue | null;
  scoreCount: number | null;
  hitCount: number | null;
  errorCount: number | null;
  startPitchId: PitchId | null;
  endPitchId: PitchId | null;

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

export type HalfInningSubset = Partial<HalfInning> &
  Pick<HalfInning, 'id' | 'inningNo' | 'halfInning'>;

// nullish 表示「還沒開始」的資料，能夠填寫 null 值的都代表會有另一個 pending 的狀態

/**
 * 1. GamePlay 指的是「實際比賽的場次」，因為可能會延賽、保留等。所以一場比賽，可能會實際打多個場次
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
  durationSeconds: number | null;
  // 還沒開始是 null，開始之後沒分數會變成 0
  homeScore: number | null;
  visitingScore: number | null;
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

  // 原資料的來源，基本上 Record<string, string> 都行？
  source: Record<string, string>;
};

/**
 * subset 意味著，如果要作 update，這會是最基本需要的資料，留這些資料的原因是這些資訊才能夠最基本的對到一個 game 的 entity。可以想樣的情境是：如要預先建好這些「空的」比賽，最少需要什麼資料？
 * 另外也代表著，
 * 1. 在從 GamePlaySubset  => GamePlay 需要補值
 * 2. 在 merge 的時候，這些空值不能覆蓋有真正值的東西
 * 3. 其實基本上就是各個 data entity 裡面，id 的成分就是最小需要的資料
 */
//
export type GamePlaySubset = Partial<GamePlay> &
  Pick<GamePlay, 'id' | 'gameId' | 'startDatetime'>;

// 比賽的資訊，對到唯一的 gameId (CPBL 就是 GameNo + year)
export type Game = {
  id: Types.GameId;
  year: Types.Year;
  // 外面先有一層，裡面保險起見有留一層，雖然我不知道會不會有季中改名的可能
  homeTeamCode: TeamCodeValue | null;
  visitingTeamCode: TeamCodeValue | null;
  kind: KindCodeValue;
  season: GameSeasonValue;
  seriesNo: number;
  plays: Types.GamePlayId[];
  level: LevelValue;
  // 原資料的來源，基本上 Record<string, string> 都行？
  source: Record<string, string>;
};

export type GameSubset = Partial<Game> &
  Pick<Game, 'id' | 'year' | 'kind' | 'season' | 'seriesNo' | 'level'>;

export type GameWithoutPlays = Omit<Game, 'plays'>;
