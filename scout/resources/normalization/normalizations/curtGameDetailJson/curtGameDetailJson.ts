import { createGamePlayInfo } from '#resources/schema/schemas/game';
import { GameResultMap } from '@bandwagon/shared/constants';
import { validate } from './validation';
import * as Types from '#shared/utils/types';
import * as Time from '#shared/utils/time';
import type { GamePlaySubset } from '#shared/model/game';

const transformNameValue = (input: string) => {
  return input === '' ? null : input;
};

export const normalizeCurtGameDetailJson = (input: string): GamePlaySubset => {
  // parse
  const curtGameDetail = JSON.parse(input);

  const validCurtGameDetail = validate(curtGameDetail);

  // 在這裡就要整理出：一個 Game 下面有幾個 GamePlay 了

  const gameId = Types.assembleGameId({
    year: validCurtGameDetail.Year,
    level: 'cpbl',
    kind: validCurtGameDetail.KindCode,
    seriesno: validCurtGameDetail.GameSno.toString(),
  });

  const startDt = Time.fromISO(validCurtGameDetail.GameDateTimeS);

  const gamePlayId = Types.assembleGamePlayId({ gameId, datetime: startDt });

  const mvpOutsPitchedCount =
    (validCurtGameDetail.InningPitchedCnt ?? 0) * 3 +
    (validCurtGameDetail.InningPitchedDiv3Cnt ?? 0);
  // 全部都要轉過來，但是之後要不要用給外面決定
  const gamePlayInfo = createGamePlayInfo({
    id: gamePlayId,
    gameId,
    isGameStop: validCurtGameDetail.IsGameStop === '1' ? true : false,
    startDatetime: Types.createDtStrFromIsoStr(
      validCurtGameDetail.GameDateTimeS
    ),
    endDatetime: Types.createNullableDtStrFromIsoStr(
      validCurtGameDetail.GameDateTimeE ?? ''
    ),
    durationSeconds: Types.transDuringTimeToMS(
      validCurtGameDetail.GameDuringTime
    ),
    field: validCurtGameDetail.FieldNo,
    result: GameResultMap[validCurtGameDetail.GameResult],
    homeScore: validCurtGameDetail.HomeTotalScore,
    visitingScore: validCurtGameDetail.VisitingTotalScore,
    winningPitcherId: transformNameValue(
      validCurtGameDetail.WinningPitcherAcnt
    ),
    loserPitcherId: transformNameValue(validCurtGameDetail.LosePitcherAcnt),
    closerId: transformNameValue(validCurtGameDetail.CloserPitcherAcnt),

    audienceCount: validCurtGameDetail.AudienceCnt,
    winningRbiHitterId: transformNameValue(
      validCurtGameDetail.GameWinningRbiAcnt
    ),

    mvpPlayerId: transformNameValue(validCurtGameDetail.MvpAcnt),
    mvpCount: validCurtGameDetail.MvpCnt,
    mvpAbCount: validCurtGameDetail.HitCnt,
    mvpRbiCount: validCurtGameDetail.RunBattedInCnt,
    mvpRunCount: validCurtGameDetail.ScoreCnt,
    mvpHitCount: validCurtGameDetail.HittingCnt,
    mvpHomeRunCount: validCurtGameDetail.HomeRunCnt,
    mvpKCount: validCurtGameDetail.StrikeOutCnt,
    mvpRaCount: validCurtGameDetail.MvpCnt,
    mvpOutsPitchedCount,
    mvpIsVisitingTeam: validCurtGameDetail.MvpVisitingHomeType === '1',

    umpireHp: validCurtGameDetail.HeadUmpire,
    umpire1b: validCurtGameDetail.OneBaseReferee,
    umpire2b: validCurtGameDetail.TwoBaseReferee,
    umpire3b: validCurtGameDetail.TrheeBaseReferee,
    umpireLf: validCurtGameDetail.LeftFieldReferee,
    umpireRf: validCurtGameDetail.RightFieldReferee,
  });

  return {
    ...gamePlayInfo,
    id: gamePlayId,
    gameId,
  };

  // return Object.values(gameRecords);
};

export default normalizeCurtGameDetailJson;
