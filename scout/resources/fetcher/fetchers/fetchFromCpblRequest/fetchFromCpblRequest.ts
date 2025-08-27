import { intercept } from '#resources/fetcher/utils/interceptNetworkFromPage';
import { Dispatcher, request } from 'undici';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';

import { z } from 'zod';

const ORIGIN = 'https://www.cpbl.com.tw';

// 幾乎資料都是這個格式
export type CpblPayload = Record<string, string>;

export type CpblRequestInfo<T extends CpblPayload = CpblPayload> = {
  path: string;
  endpointPath: string;
  method: Dispatcher.HttpMethod;
  body: T;
  dataKey: string;
};

export const siteResponseSchema = z
  .object({
    Success: z.boolean(),
  })
  .catchall(z.string());

export const createFormdataBody = (payload: CpblPayload) => {
  return new URLSearchParams(payload).toString();
};

const fetchFromCpblRequest = async <T extends CpblPayload>({
  path,
  endpointPath,
  body,
  method = 'POST', // CPBL 官網預設都幾乎是 POST
  dataKey,
}: CpblRequestInfo<T>) => {
  const siteUrl = `${ORIGIN}${path}`;
  const endpoint = `${ORIGIN}${endpointPath}`;

  console.log('fetchFromCpblRequest', {
    siteUrl,
    endpoint
  });
  

  const interceptedData = await intercept(siteUrl, [endpoint]);
  const req = interceptedData[endpoint]?.request;

  if (!req) {
    throw new Error('request not found');
  }

  const headers = req.headers();
  const urlFromReq = req.url();

  const res = await request(urlFromReq, {
    method,
    body: createFormdataBody(body),
    headers,
  });

  // request 失敗的 error handling

  const json = await res.body.json();
  const { Success, [dataKey]: gamedatas } = siteResponseSchema.parse(json);

  if (!Success) {
    throw new Error('Data: request fail');
  }

  return gamedatas;
};

export { fetchFromCpblRequest };
