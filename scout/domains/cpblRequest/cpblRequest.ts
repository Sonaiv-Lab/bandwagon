import { BulkJobOptions, Job, Processor, Queue } from 'bullmq';
import {
  type CpblRequestInfo,
  type CpblPayload,
} from '#resources/fetcher/fetchers/fetchFromCpblRequest';
import { stringifyRecord } from '#shared/utils/stringifyRecord';

export type CPBLRequestProcessor<
  TDataKey extends string,
  T extends CpblPayload
> = Processor<CpblRequestInfo<TDataKey, T>>;

export type { CpblRequestInfo };

export const createCpblRequestJobName = (name: string) =>
  `cpbl::${name}::endpoint`;

export const createCpblRequestJob = <TDataKey extends string, T extends CpblPayload>(
  name: string,
  data: CpblRequestInfo<TDataKey, T>
) => {
  const id = `${name}::${stringifyRecord({
    ...data.body,
    method: data.method,
    endpointPath: data.endpointPath,
  })}`;

  return {
    name,
    data,
    opts: { deduplication: { id } },
  };
};
