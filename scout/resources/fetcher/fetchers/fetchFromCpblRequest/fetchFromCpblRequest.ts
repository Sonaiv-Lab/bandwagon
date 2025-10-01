import { intercept } from '#resources/fetcher/utils/interceptNetworkFromPage';
import { Dispatcher, request } from 'undici';
import { toFormdataBody } from '#shared/utils/formdata';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';

import { z, ZodString } from 'zod';

const ORIGIN = 'https://www.cpbl.com.tw';

// 幾乎資料都是這個格式
export type CpblPayload = Record<string, string>;

export type CpblRequestInfo<
  TDataKey extends string,
  T extends CpblPayload = CpblPayload
> = {
  path: string;
  endpointPath: string;
  method: Dispatcher.HttpMethod;
  body: T;
  dataKeys: TDataKey[];
};

const fetchFromCpblRequest = async <
  TDataKey extends string,
  T extends CpblPayload
>({
  path,
  endpointPath,
  body,
  method = 'POST', // CPBL 官網預設都幾乎是 POST
  dataKeys,
}: CpblRequestInfo<TDataKey, T>) => {
  const siteUrl = `${ORIGIN}${path}`;
  const endpoint = `${ORIGIN}${endpointPath}`;

  console.log('fetchFromCpblRequest', {
    siteUrl,
    endpoint,
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
    body: toFormdataBody(body),
    headers,
  });

  // request 失敗的 error handling

  const json = await res.body.json();

  const dataSchema = dataKeys.reduce((schema, key) => {
    schema[key] = z.string();

    return schema;
  }, {} as Record<string, ZodString>);

  const { Success, ...responseData } = z
    .object({
      Success: z.boolean(),
    })
    .extend(dataSchema)
    .parse(json);

  if (!Success) {
    throw new Error('Data: request fail');
  }

  return responseData;
};

export { fetchFromCpblRequest };
