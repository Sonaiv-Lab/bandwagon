import { GamePlayInfo } from '#shared/model/game';
import { GameResult } from '@bandwagon/shared/constants';
import { DateTime } from 'luxon';

/**
 * 與比賽狀態相關的選手欄位
 * 比賽結束也可以沒有勝投敗投 => 裁定和局
 */
export const checkPlayerRelatedFieldWithGameResult = [
  (game: GamePlayInfo) => {
    if (game.result === 'pending' && !game.isPlayBall) {
      const isFieldsEmpty = [
        game.winningPitcherId,
        game.winningPitcherName,
        game.loserPitcherId,
        game.loserPitcherName,
        game.closerId,
        game.closerName,
        game.mvpPlayerId,
        game.mvpPlayerName,
        game.mvpCount
      ].every((val) => val === null);

      return isFieldsEmpty
    }

    return true;
  },
  {
    error:
      'game not start yet, game result related player field should be empty',
  },
] as const;

export const datetimeOrder = [
  ({
    endDatetime: endDatetimeString,
    startDatetime: startDatetimeString,
  }: GamePlayInfo) => {
    if (!endDatetimeString) {
      return true;
    }

    const endDatetime = DateTime.fromISO(endDatetimeString);
    const startDatetime = DateTime.fromISO(startDatetimeString);
    return endDatetime > startDatetime;
  },
  {
    error: 'endDatetime should latter than startDatetime',
  },
] as const;

export const pendingEndDatetime = [
  ({ result, endDatetime }: GamePlayInfo) => {
    if (result === 'pending') {
      return endDatetime === null
    } 

    return true
  },
  {
    error: 'result is pending, endDatetime should be null',
  },
] as const;

export const pendingScore = [
  ({ result, homeScore, visitingScore, isPlayBall }: GamePlayInfo) => {
    if (result === 'pending' && !isPlayBall) {
      return homeScore === 0 && visitingScore === 0;
    } 

    return true
  },
  { error: 'game not start yet, score should be 0' },
] as const;
