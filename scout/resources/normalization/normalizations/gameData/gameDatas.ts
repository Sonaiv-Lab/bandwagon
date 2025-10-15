import { createGame, createGamePlayInfo } from '#resources/schema/schemas/game';
import { FIELD_OPTS, GameResultMap } from '@bandwagon/shared/constants';
import { type GameData, validate } from './validation';
import * as Types from '#shared/utils/types';
import * as Time from '#shared/utils/time';

const transformPlayerRelatedValue = (input: string) => {
  return input === '' ? null : input;
};

// ID 不再 normalize 階段改，而在 plan 階段出來
const normalizeGame = (gameId: string, game: GameData) => {
  const year = game.Year;
  const level = 'cpbl';
  const kind = game.KindCode;
  const seriesNo = game.GameSno;

  return createGame({
    id: gameId,
    year,
    seriesNo,
    homeTeamCode: game.HomeTeamCode,
    visitingTeamCode: game.VisitingTeamCode,
    kind,
    season: game.GameSeasonCode,
    level,
  });
};

const normalizeGamePlay = ({
  game,
  playId,
  gameId,
}: {
  game: GameData;
  playId: Types.GamePlayId;
  gameId: Types.GameId;
}) => {
  return createGamePlayInfo({
    gameId,
    id: playId,
    isGameStop: game.IsGameStop === '1' ? true : false,
    // 是不是正在比賽
    isPlayBall: game.IsPlayBall === 'Y' ? true : false,
    startDatetime: Types.createDtStrFromIsoStr(game.GameDateTimeS),
    endDatetime: Types.createNullableDtStrFromIsoStr(game.GameDateTimeE ?? ''),
    durationSeconds: Types.transDuringTimeToMS(game.GameDuringTime),
    field: FIELD_OPTS[game.FieldAbbe],
    result: GameResultMap[game.GameResult],
    homeScore: game.HomeScore,
    visitingScore: game.VisitingScore,
    reserveDate: Types.createNullableDtStrFromIsoStr(
      game.ReserveDate ?? '',
      'Asia/Taipei'
    ),
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
  game: ReturnType<typeof createGame>;
  plays: ReturnType<typeof createGamePlayInfo>[];
};

/**
  在這裡要處理掉有多個
*/
export const normalizeGameDatas = (input: string): NormalizeOutput[] => {
  // parse
  const gameDatas = JSON.parse(input);


  /**
   * 紀錄一下，不然連自己都忘記
   * 這裡的 validate 只單純檢查「資料」，而不檢查 schema，基本上反序列化外部資料的過程
   * 功能放在「檢查外部資料」
   * 
   * => 資料容忍度可能沒那麼高，另外可能會蠻常錯的
   */
  const validGameDatas = validate(gameDatas);

  const gameRecords: Record<
    Types.GameId,
    {
      game: ReturnType<typeof createGame>;
      plays: ReturnType<typeof createGamePlayInfo>[];
    }
  > = {};


  /**
   * 這裡才是真正的建立「資料」，需要 schema 的介入，schema 基本上代表著 model 的實現
   */
  for (const gameSubsetData of validGameDatas) {
    const year = gameSubsetData.Year;
    const level = 'cpbl';
    const kind = gameSubsetData.KindCode;
    const seriesNo = gameSubsetData.GameSno;

    const gameId = Types.assembleGameId({
      year,
      level,
      kind,
      seriesno: seriesNo.toString(),
    });

    const startDt = Time.fromISO(gameSubsetData.GameDateTimeS);

    const playId = Types.assembleGamePlayId({ gameId, datetime: startDt });

    const game = normalizeGame(gameId, gameSubsetData);
    const gamePlay = normalizeGamePlay({ game: gameSubsetData, gameId, playId });

    if (gameId in gameRecords) {
      const targetRecord = gameRecords[gameId];
      targetRecord.game = game;
      // 有多場同 Id 的比賽
      targetRecord.plays = [...targetRecord.plays, gamePlay].sort(
        (
          { startDatetime: startDatetimeA },
          { startDatetime: startDatetimeB }
        ) => {
          const milsA = startDatetimeA
            ? Time.fromISO(startDatetimeA).toMillis()
            : 0;

          const milsB = startDatetimeB
            ? Time.fromISO(startDatetimeB).toMillis()
            : 0;

          return milsA - milsB;
        }
      );
    } else {
      gameRecords[gameId] = {
        game: game,
        plays: [gamePlay],
      };
    }
  }

  return Object.values(gameRecords);
};

export default normalizeGameDatas;
