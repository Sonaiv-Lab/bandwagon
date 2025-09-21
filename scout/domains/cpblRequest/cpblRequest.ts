import { BulkJobOptions, Job, Processor, Queue } from 'bullmq';
import {
  type CpblRequestInfo,
  type CpblPayload,
} from '#resources/fetcher/fetchers/fetchFromCpblRequest';

type BulkJob<T extends CpblPayload> = {
  name: string;
  data: CpblRequestInfo<T>;
  opts: BulkJobOptions;
};

export type CPBLRequestProcessor<T extends CpblPayload> = Processor<
  CpblRequestInfo<T>
>;

export type { CpblRequestInfo };

// 未來需要一個類似 react query 的建立 key 的機制
const createIdFromInfo = (data: CpblRequestInfo<CpblPayload>): string => {
  const bodyKeys = Object.keys(data.body).sort();
  const stableBodyStringified = bodyKeys
    .map((key) => {
      const value = data.body[key];
      return `${key}:${value}`;
    })
    .join(',');

  return `${data.method}${data.endpointPath}${stableBodyStringified}`;
};

export const createCpblRequestJobName = (name: string) => `cpbl::request::${name}`;

export const createCpblRequestJob = <T extends CpblPayload>(
  name: string,
  data: CpblRequestInfo<T>
): BulkJob<T> => {
  const id = createIdFromInfo(data);
  return {
    name,
    data,
    opts: { deduplication: { id } },
  };
};
