import z from 'zod';
import { Firestore } from '#shared/external/firestore';
import { Job, Processor } from 'bullmq';
import { UnstableQueue } from '#shared/external/queue/unstableQueue';
import { stringifyRecord } from '#shared/utils/stringifyRecord';
import { toFormdataBody, DecodedFormdata } from '#shared/utils/formdata';
import { getlivePayloadSchema, getliveResponseSchema } from './utils';
import { request } from 'undici';
import { RegisteredContext } from '#shared/utils/container';

const boxRequestJobName = `cpbl::box::getLive`;

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

export const addGetliveJob = (
  { unstableQueue }: { unstableQueue: UnstableQueue },
  props: JobProps
) => {
  const result = getlivePayloadSchema.safeParse(props.payload, {
    reportInput: true,
  });
  if (!result.success) {
    const pretty = z.prettifyError(result.error);
    throw new Error(`${boxRequestJobName}: \n${pretty}`);
  }

  const job = createGetliveJob(props);
  const { name, data, opts } = job;

  return unstableQueue.queue.add(name, data, opts);
};

// 之後再用 fetchCpblRequest，現在現這樣
export const getliveProcessor = async (
  context: RegisteredContext,
  job: Job<JobData>
) => {
  const response = await request(job.data.url, {
    headers: job.data.headers,
    method: job.data.method,
    body: job.data.body,
  });
  

  const body = await response.body.json();

  const validBody = getliveResponseSchema.parse(body);

  console.log('validBody', validBody);
};

export {
  getliveProcessor as processor,
  addGetliveJob as addJob,
  boxRequestJobName as name,
};
