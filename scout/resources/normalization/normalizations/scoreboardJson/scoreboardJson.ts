import { validate } from './validation';
import type { GamePlay } from '#shared/model/game';
import { assemblePitchId } from '#shared/utils/types/id/pitchId';

const emptyStrToNull = (input: string) => {
  return input === '' ? null : input;
};

type PartialHalfInning = Partial<GamePlay['halfInnings'][number]>;

export const normalizeScoreboardJson = (input: string): PartialHalfInning[] => {
  // parse
  const scoreboard = JSON.parse(input);

  const validScoreboard = validate(scoreboard);

  const halfInnings = [];

  for (const data of validScoreboard) {
    const halfInning = (
      {
        '1': 't',
        '2': 'b',
      } as const
    )[data.VisitingHomeType];

    const halfInningData: PartialHalfInning = {
      scoreCount: data.ScoreCnt,
      hitCount: data.HittingCnt,
      errorCount: data.ErrorCnt,
      halfInning,
      // TODO 先用這個，要作的事情有
      // 1. 搞懂 MainEvent, SubEvent 事什麼
      // 建立自己的 Pitch Id
      inningNo: data.InningSeq,
      source: {
        MainEventNoS: data.MainEventNoS,
        SubEventNoS: data.SubEventNoS,
        MainEventNoE: data.MainEventNoE,
        SubEventNoE: data.SubEventNoE,
      },
    };

    halfInnings.push(halfInningData);
  }

  return halfInnings;
};

export default normalizeScoreboardJson;
