import { intercept } from '#resources/fetcher/utils/interceptNetworkFromPage';
import { request } from 'undici';
import { createBody, getgamedatasResponseSchema } from './utils';

const ORIGIN = 'https://www.cpbl.com.tw';
const URL = 'https://www.cpbl.com.tw/schedule';
const ENDPOINT = 'https://www.cpbl.com.tw/schedule/getgamedatas';

const fetchSchedulePage = async () => {
  const interceptedData = await intercept(URL, [ENDPOINT]);

  const req = interceptedData[ENDPOINT]?.request;

  if (!req) {
    throw new Error('request not found');
  }

  const headers = req.headers();
  const url = req.url();

  // 抽出去當作變數
  const body = createBody({
    calendar: '2025/01/01',
    location: '',
    kindCode: 'A',
  });

  const res = await request(url, {
    method: 'POST',
    body,
    headers,
  });

  // request 失敗的 error handling

  const json = await res.body.json();
  const { Success, GameDatas: gamedatas } =
    getgamedatasResponseSchema.parse(json);

  if (!Success) {
    throw new Error('gamedatas: request fail');
  }

  return gamedatas;
};

export default fetchSchedulePage;
