import { GameSchema } from '#resources/schema/schemas/game';
import { GameId, GamePlayId, assembleGameId } from '#shared/utils/types';
import {
  GameResult,
  FIELD_OPTS,
  GameResultMap,
} from '@bandwagon/shared/constants';
import { transformDuringTime } from './utils';
import { gamesDatasSchema, type GameData, validate } from './validation';
import { createNullableDateTime, createDateTime } from '#shared/utils/types';
import { DateTime } from 'luxon';
import { z } from 'zod';

const { createGameInfo, createGamePlayInfo } = GameSchema.use;

const transformPlayerRelatedValue = (input: string) => {
  return input === '' ? null : input;
};

// ID 不再 normalize 階段改，而在 plan 階段出來
const normalizeGame = (game: GameData) => {
  const year = game.Year;
  const level = 'cpbl';
  const kind = game.KindCode;
  const seriesNo = game.GameSno;

  return createGameInfo({
    year,
    seriesNo,
    homeTeamCode: game.HomeTeamCode,
    visitingTeamCode: game.VisitingTeamCode,
    kind,
    season: game.GameSeasonCode,
    level,
  });
};

const normalizeGamePlay = (game: GameData) => {
  return createGamePlayInfo({
    isGameStop: game.IsGameStop === '1' ? true : false,
    // 是不是正在比賽
    isPlayBall: game.IsPlayBall === 'Y' ? true : false,
    startDatetime: createDateTime(game.GameDateTimeS, 'Asia/Taipei'),
    endDatetime: createNullableDateTime(
      game.GameDateTimeE ?? '',
      'Asia/Taipei'
    ),
    durationSeconds: transformDuringTime(game.GameDuringTime),
    field: FIELD_OPTS[game.FieldAbbe],
    result: game.GameResult,
    homeScore: game.HomeScore,
    visitingScore: game.VisitingScore,
    reserveDate: createNullableDateTime(game.ReserveDate ?? '', 'Asia/Taipei'),
    visitingPitcherId: transformPlayerRelatedValue(game.VisitingPitcherAcnt),
    visitingPitcherName: transformPlayerRelatedValue(game.VisitingPitcherName),
    homePitcherId: transformPlayerRelatedValue(game.HomePitcherAcnt),
    homePitcherName: transformPlayerRelatedValue(game.HomePitcherName),
    winningPitcherId: transformPlayerRelatedValue(game.WinningPitcherAcnt),
    winningPitcherName: transformPlayerRelatedValue(game.WinningPitcherName),
    loserPitcherId: transformPlayerRelatedValue(game.LoserPitcherAcnt),
    loserPitcherName: transformPlayerRelatedValue(game.LoserPitcherName),
    closerId: transformPlayerRelatedValue(game.CloserAcnt),
    closerName: transformPlayerRelatedValue(game.CloserName),
    mvpCount: game.MvpCount,
    mvpPlayerId: transformPlayerRelatedValue(game.MvpAcnt),
    mvpPlayerName: transformPlayerRelatedValue(game.MvpName),
  });
};

type NormalizeOutput = {
  game: ReturnType<typeof createGameInfo>;
  plays: ReturnType<typeof createGamePlayInfo>[];
};

/**
  在這裡要處理掉有多個
*/
export const normalizeGameDatas = (input: string): NormalizeOutput[] => {
  // parse
  const gameDatas = JSON.parse(input);

  const checkedGameDatas = validate(gameDatas);

  // 在這裡就要整理出：一個 Game 下面有幾個 GamePlay 了

  const gameRecords: Record<
    GameId,
    {
      game: ReturnType<typeof createGameInfo>;
      plays: ReturnType<typeof createGamePlayInfo>[];
    }
  > = {};

  for (const game of checkedGameDatas) {
    const year = game.Year;
    const level = 'cpbl';
    const kind = game.KindCode;
    const seriesNo = game.GameSno;

    const gameInfo = normalizeGame(game);
    const gamePlayInfo = normalizeGamePlay(game);
    const gameId = assembleGameId({
      year,
      level,
      kind,
      seriesno: seriesNo.toString(),
    });

    if (gameId in gameRecords) {
      const targetRecord = gameRecords[gameId];
      targetRecord.game = gameInfo;
      // 有多場同 Id 的比賽
      targetRecord.plays = [...targetRecord.plays, gamePlayInfo].sort(
        (
          { startDatetime: startDatetimeA },
          { startDatetime: startDatetimeB }
        ) => {
          return DateTime.fromISO(startDatetimeA) >
            DateTime.fromISO(startDatetimeB)
            ? 1
            : -1;
        }
      );
    } else {
      gameRecords[gameId] = {
        game: gameInfo,
        plays: [gamePlayInfo],
      };
      
    }
  }

  return Object.values(gameRecords);
};

export default normalizeGameDatas;
