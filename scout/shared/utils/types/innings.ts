import { createHalfInning } from '#resources/schema/schemas/game';
import { HalfInningSubset } from '#shared/model/game';
import * as Types from '#shared/utils/types';

export const createEmptyHalfInnings = (playId: Types.GamePlayId) => {
  return Array.from(new Array(9 * 2), (_, i) => {
    const inning = Math.floor(i / 2) + 1;
    const halfInning: Types.InningIdParts['halfInning'] =
      i % 2 === 0 ? 't' : 'b';

    const id = Types.assembleInningId({
      playId,
      inningNo: inning,
      halfInning,
    });

    const emptyInning = createHalfInning({
      id,
      inningNo: inning,
      halfInning,
    });

    return emptyInning;
  });
};

export const sortHInnings = (
  inningA: Partial<HalfInningSubset>,
  inningB: Partial<HalfInningSubset>
) => {
  const HALF_INNING_WEIGHT = {
    t: 0.1,
    b: 0.2,
    '': 0.9,
  } as const;
  const inningAWeight =
    inningA.inningNo ?? 0 + HALF_INNING_WEIGHT[inningA.halfInning ?? ''];
  const inningBWeight =
    inningB.inningNo ?? 0 + HALF_INNING_WEIGHT[inningB.halfInning ?? ''];

  return inningAWeight - inningBWeight;
};
