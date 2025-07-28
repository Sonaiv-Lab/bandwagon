import { intercept } from '../utils/interceptNetworkFromPage';
import { request } from 'undici';
import { z } from 'zod';
import { FieldOptsScheme } from '@bandwagon/shared/constants/fieldOpts';
import { Scheme as KindCodeScheme } from '@bandwagon/shared/constants/kindCode';

const ORIGIN = 'https://www.cpbl.com.tw';
const URL = 'https://www.cpbl.com.tw/schedule';
const ENDPOINT = 'https://www.cpbl.com.tw/schedule/getgamedatas';

const createBody = (body: Body) => {
  console.log('123123');
  return new URLSearchParams(body).toString();
};


const ResponseSchema = z.object({
  Success: z.boolean(),
  GameDatas: z.string(),
});

type TResponseSchema = z.infer<typeof ResponseSchema>;


const Body = z
  .object({
    calendar: z.string().regex(/\d\d\d\d\/\d\d\/\d\d/), // YYYY/MM/DD
    location: FieldOptsScheme,
    kindCode: KindCodeScheme,
  })
  .required();

  type Body = z.infer<typeof Body>;

const fetchSchedulePage = async () => {
  const interceptedData = await intercept(URL, [ENDPOINT]);

  const req = interceptedData[ENDPOINT]?.request;

  if (!req) {
    throw new Error('request not found');
  }

  const headers = req.headers();
  const url = req.url();

  const body = {
    calendar: '2025/01/01',
    location: '',
    kindCode: 'A',
  } satisfies Body;

  const res = await request(url, {
    method: 'POST',
    body: createBody(body),
    headers,
  });

  const json = (await res.body.json()) as TResponseSchema;

  return json;
};

export default fetchSchedulePage;