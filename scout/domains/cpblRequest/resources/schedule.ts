import {
  createCpblRequestJob,
  createCpblRequestJobName,
  type CPBLRequestProcessor,
} from '../cpblRequest';
import {
  KindCodeValue,
  kindCodeSchema,
} from '@bandwagon/shared/constants/kindCode';
import { normalizeGameDatas } from '#resources/normalization/normalizations/gameData';
import type { DateYYYY_MM_DD } from '#shared/utils/types';
import { FieldOptsValue } from '@bandwagon/shared/constants/fieldOpts';
import { fetchFromCpblRequest } from '#resources/fetcher/fetchers/fetchFromCpblRequest';
import { planGameMutation } from '#resources/plan/plans/game';

import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import z from 'zod';
import { Firestore } from '#shared/external/firestore';
import { Queue } from 'bullmq';

type SchedulePageParams = {
  year: string;
  kindCode: KindCodeValue;
};

const NAME = 'schedule';

const scheduleJobName = createCpblRequestJobName(NAME);

type GetgamedatasPayload = {
  calendar: DateYYYY_MM_DD;
  location: FieldOptsValue | '';
  kindCode: KindCodeValue;
};

const schedulePageParamsSchema = z.object({
  kindCode: kindCodeSchema,
  year: z.string().regex(/\d\d\d\d/),
}) satisfies SchemaFromInterface<SchedulePageParams>;

const createJob = (params: unknown) => {
  try {
    const validProps = schedulePageParamsSchema.parse(params);
    // const validProps = propsSchema.parse(prop);
    const body = {
      calendar: `${validProps.year}/01/01`,
      location: '',
      kindCode: validProps.kindCode,
    } satisfies GetgamedatasPayload;

    return createCpblRequestJob<'GameDatas', GetgamedatasPayload>(
      scheduleJobName,
      {
        path: '/schedule',
        endpointPath: '/schedule/getgamedatas',
        method: 'POST',
        body,
        dataKeys: ['GameDatas'],
      }
    );
  } catch (err) {
    throw err;
  }
};

export const addJob = (queue: Queue, props: unknown) => {
  const job = createJob(props);
  const { name, data, opts } = job;

  return queue.add(name, data, opts);
};

const createProcessor: (
  getStore: () => Firestore
) => CPBLRequestProcessor<'GameDatas', GetgamedatasPayload> =
  (getStore) => async (job) => {
    const store = getStore();

    const requestData = await fetchFromCpblRequest(job.data);
    const gamesData = normalizeGameDatas(requestData.GameDatas);

    const data = [...gamesData];

    const mutations = data.flatMap(({ game, plays }) => {
      return planGameMutation({ game, plays }, store)();
    });

    const executions = await Promise.allSettled(mutations);

    const output = executions.reduce(
      (accum, promise) => {
        if (promise.status === 'fulfilled') {
          accum.success.push(promise.value.target);
        }
        if (promise.status === 'rejected') {
          accum.errors.push(promise.reason);
        }

        return accum;
      },
      { success: [], errors: [] } as { success: string[]; errors: any[] }
    );
    return JSON.stringify(output);
  };

export { createJob, createProcessor, scheduleJobName as name };
