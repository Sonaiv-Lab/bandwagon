import { intercept } from '#resources/fetcher/utils/interceptNetworkFromPage';
import z from 'zod';
import { Processor } from 'bullmq';
import { URLSearchParams } from 'node:url';
import { stringifyRecord } from '#shared/utils/stringifyRecord';
import {
  BoxPageParams,
  getlivePayloadSchema,
  boxPageParamsSchema,
} from './utils';
import * as getLive from './getLive';
import type { Applicable, RegisteredContext } from '#shared/utils/container';

const boxPageJobName = `cpbl::box::boxPage`;

const createBoxPageJob = (params: BoxPageParams) => {
  const id = `${boxPageJobName}::${stringifyRecord(params)}`;

  return {
    name: boxPageJobName,
    opts: { deduplication: { id } },
    data: params,
  };
};

export const addBoxPageJob = (ctx: RegisteredContext, props: unknown) => {
  const result = boxPageParamsSchema.safeParse(props, { reportInput: true });
  if (!result.success) {
    const pretty = z.prettifyError(result.error);
    throw new Error(`${boxPageJobName}: \n${pretty}`);
  }

  const validParams = result.data;

  const job = createBoxPageJob(validParams);
  const { name, data, opts } = job;

  return ctx.unstableQueue.queue.add(name, data, opts);
};

const boxPageProcessor: Applicable<Processor<BoxPageParams>> = async (
  ctx: RegisteredContext,
  job
) => {
  const params = new URLSearchParams(job.data);
  const siteUrl = `https://www.cpbl.com.tw/box?${params.toString()}`;
  const endpoint = `https://www.cpbl.com.tw/box/getlive`;

  const { [endpoint]: { request } = {} } = await intercept(siteUrl, [endpoint]);

  if (!request) {
    throw new Error(`${endpoint} endpoint not found`);
  }

  const formPayload = request.postData();
  const payload = Object.fromEntries(new URLSearchParams(formPayload ?? ''));

  const headers = request.headers();

  const validPayload = getlivePayloadSchema.parse(payload);

  const getLiveJob = await getLive.addJob(ctx, {
    payload: validPayload,
    headers,
  });

  return getLiveJob;
};

export {
  boxPageJobName as name,
  addBoxPageJob as addJob,
  boxPageProcessor as processor
};
