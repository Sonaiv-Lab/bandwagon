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
import { getFirestore } from "#shared/external/firestore";

type SchedulePageProp = {
  year: string;
  kindCode: KindCodeValue;
};

const NAME = 'schedule';

const scheduleJobName = createCpblRequestJobName(NAME);

type Payload = {
  calendar: DateYYYY_MM_DD;
  location: FieldOptsValue | '';
  kindCode: KindCodeValue;
};

const propsSchema = z.object({
  kindCode: kindCodeSchema,
  year: z.string().regex(/\d\d\d\d/),
}) satisfies SchemaFromInterface<SchedulePageProp>;

const createJob = (prop: SchedulePageProp) => {
  // const validProps = propsSchema.parse(prop);
  const body = {
    calendar: `${prop.year}/01/01`,
    location: '',
    kindCode: prop.kindCode,
  } satisfies Payload;


  return createCpblRequestJob<Payload>(scheduleJobName, {
    path: '/schedule',
    endpointPath: '/schedule/getgamedatas',
    method: 'POST',
    body,
    dataKey: 'GameDatas',
  });
};

const processor: CPBLRequestProcessor<Payload> = async (
  job
) => {
  const store = await getFirestore();

  const dataText = await fetchFromCpblRequest(job.data);
  const gamesData = normalizeGameDatas(dataText);

  const output = [...gamesData]

  const mutations = output.map(({ game, plays }) => {
    return planGameMutation({ game, plays }, store);
  });

  const executions = mutations.map((mut) =>
    mut()
  );

  return await executions;
};

export { createJob, processor, scheduleJobName as name, propsSchema };
