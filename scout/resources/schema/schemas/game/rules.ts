import { GamePlaySubset } from '#shared/model/game';
import * as Time from "#shared/utils/time";

type GamePlayInfoCheck = (game: GamePlaySubset) => boolean;

type Rule = [GamePlayInfoCheck, { error: string }];

/**
 * 與比賽狀態相關的選手欄位
 * 比賽結束也可以沒有勝投敗投 => 裁定和局
 */
export const checkPlayerRelatedFieldWithGameResult: Rule = [
  (game) => {
    if (game.result === 'pending' && !game.isPlayBall) {
      const isFieldsEmpty = [
        game?.winningPitcherId,
        game?.winningPitcherName,
        game?.loserPitcherId,
        game?.loserPitcherName,
        game?.closerId,
        game?.closerName,
        game?.mvpPlayerId,
        game?.mvpPlayerName,
        game?.mvpCount,
      ].every((val) => val === null || val === undefined || val === '');

      return isFieldsEmpty;
    }

    return true;
  },
  {
    error:
      'game not start yet, game result related player field should be empty',
  },
] as const;

export const datetimeOrder: Rule = [
  ({ endDatetime: endDatetimeString, startDatetime: startDatetimeString }) => {
    // 有兩都有再檢查
    if (!endDatetimeString || !startDatetimeString) {
      return true;
    }

    const endDatetime = Time.fromISO(endDatetimeString);
    const startDatetime = Time.fromISO(startDatetimeString);
    return endDatetime > startDatetime;
  },
  {
    error: 'endDatetime should latter than startDatetime',
  },
] as const;

export const pendingEndDatetime: Rule = [
  ({ result, endDatetime }) => {
    if (result === 'pending') {
      return endDatetime === null;
    }

    return true;
  },
  {
    error: 'result is pending, endDatetime should be null',
  },
] as const;

export const pendingScore: Rule = [
  ({ result, homeScore, visitingScore, isPlayBall }) => {
    if (result === 'pending' && !isPlayBall) {
      return homeScore === 0 && visitingScore === 0;
    }

    return true;
  },
  { error: 'game not start yet, score should be 0' },
] as const;
