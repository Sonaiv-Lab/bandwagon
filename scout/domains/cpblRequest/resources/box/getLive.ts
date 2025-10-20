import z from 'zod';
import { Job } from 'bullmq';
import { stringifyRecord } from '#shared/utils/stringifyRecord';
import { toFormdataBody, DecodedFormdata } from '#shared/utils/formdata';
import { getlivePayloadSchema, getliveResponseSchema } from './utils';
import { request } from 'undici';
import { Applicable, RegisteredContext } from '#shared/utils/container';
import { normalizeScoreboardJson } from '#resources/normalization/normalizations/scoreboardJson';
import { normalizeCurtGameDetailJson } from '#resources/normalization/normalizations/curtGameDetailJson';
import {
  createGamePlay,
  createHalfInning,
} from '#resources/schema/schemas/game';
import {
  createEmptyHalfInnings,
  sortHInnings,
} from '#shared/utils/types/innings';
import { assembleInningId } from '#shared/utils/types';
import { assemblePitchId } from '#shared/utils/types/id/pitchId';
import {
  eventNoRules,
} from '#resources/normalization/schemas';
import { planPlayMutation } from '#resources/plan/plans/play';

const boxRequestJobName = `cpbl::box::getLive`;

const getPitchNoFromEventNoField = (eventNoField: string | undefined = '') => {
  // 等等抽成 getPitchNoFromEnventNo
  const pitchNoStr = eventNoRules.exec(eventNoField)?.groups?.pitchNo;
  const pitchNo = Number(pitchNoStr);

  return Number.isNaN(pitchNo) ? undefined : pitchNo;
};

// 這裡要把所有 request 需要的東西都帶進來 => method, header, body, url
type JobData = {
  headers: Record<string, string>;
  body: string;
  method: string;
  url: string;
};

type JobProps = {
  headers: JobData['headers'];
  payload: DecodedFormdata;
};

export const createGetliveJob = ({ headers, payload }: JobProps) => {
  const id = `${boxRequestJobName}::${stringifyRecord(payload)}`;

  const data: JobData = {
    url: 'https://www.cpbl.com.tw/box/getlive',
    method: 'POST',
    body: toFormdataBody(payload),
    headers,
  };

  return {
    name: boxRequestJobName,
    opts: { deduplication: { id } },
    data,
  };
};

export const addGetliveJob = (ctx: RegisteredContext, props: JobProps) => {
  const result = getlivePayloadSchema.safeParse(props.payload, {
    reportInput: true,
  });
  if (!result.success) {
    const pretty = z.prettifyError(result.error);
    throw new Error(`${boxRequestJobName}: \n${pretty}`);
  }

  const job = createGetliveJob(props);
  const { name, data, opts } = job;

  return ctx.unstableQueue.queue.add(name, data, opts);
};

// 之後再用 fetchCpblRequest，現在現這樣
export const getliveProcessor: Applicable = async (
  context,
  job: Job<JobData>
) => {
  const response = await request(job.data.url, {
    headers: job.data.headers,
    method: job.data.method,
    body: job.data.body,
  });

  const body = await response.body.json();

  const validBody = getliveResponseSchema.parse(body);

  const { gamePlayInfo, gameInfo } = normalizeCurtGameDetailJson(
    validBody.CurtGameDetailJson
  );

  const halfInnings = createEmptyHalfInnings(gamePlayInfo.id);

  const hInningsData = normalizeScoreboardJson(validBody.ScoreboardJson);

  for (const i of hInningsData) {
    const targetInningIndex = halfInnings.findIndex(
      ({ inningNo, halfInning }) => {
        return i.inningNo === inningNo && halfInning === i.halfInning;
      }
    );

    if (targetInningIndex >= 0) {
      const { id: inningId, halfInning } = halfInnings[targetInningIndex];

      const pitchNoStart = getPitchNoFromEventNoField(i?.source?.MainEventNoS);
      const pitchNoEnd = getPitchNoFromEventNoField(i?.source?.MainEventNoE);

      const startPitchId = pitchNoStart
        ? assemblePitchId({
            inningId,
            pitchNo: pitchNoStart,
          })
        : null;

      const endPitchId = pitchNoEnd
        ? assemblePitchId({
            inningId,
            pitchNo: pitchNoEnd,
          })
        : null;

      const mergedHalfInning = createHalfInning({
        ...halfInnings[targetInningIndex],
        ...i,
        offenseTeamCode:
          halfInning === 't'
            ? gameInfo.visitingTeamCode
            : gameInfo.homeTeamCode,
        defenseTeamCode:
          halfInning === 't'
            ? gameInfo.homeTeamCode
            : gameInfo.visitingTeamCode,
        endPitchId,
        startPitchId,
      });

      halfInnings[targetInningIndex] = mergedHalfInning;
    } else {
      // 只處理 9 局以後的
      if (!i.inningNo || !i.halfInning) continue;
      const id = assembleInningId({
        playId: gamePlayInfo.id,
        inningNo: i.inningNo,
        halfInning: i.halfInning,
      });

      const inningOver9 = createHalfInning({
        ...i,
        id,
        inningNo: i.inningNo,
        halfInning: i.halfInning,
      });

      halfInnings.push(inningOver9);
    }
  }

  const sorted = halfInnings.sort(sortHInnings);

  const gamePlay = createGamePlay({
    ...gamePlayInfo,
    halfInnings: sorted,
  });


  const mutations = planPlayMutation(context, { plays: [gamePlay] }).map(
    (mutate) => mutate()
  );

  const executions = await Promise.allSettled(mutations);

  const output = executions.reduce(
    (accum, promise) => {
      if (promise.status === 'fulfilled') {
        accum.success.push(promise.value.target);
      }
      if (promise.status === 'rejected') {
        console.log(promise.reason);

        accum.errors.push(promise.reason);
      }

      return accum;
    },
    { success: [], errors: [] } as { success: string[]; errors: any[] }
  );
  return JSON.stringify(output);
};

export {
  getliveProcessor as processor,
  addGetliveJob as addJob,
  boxRequestJobName as name,
};
