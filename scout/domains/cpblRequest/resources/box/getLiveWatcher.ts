import { getPlay, getPlays } from '#resources/store/stores/plays';

import * as Types from '#shared/utils/types';
import * as Time from '#shared/utils/time';
import { RegisteredContext } from '#shared/utils/container';
import { Job } from 'bullmq';
import { intercept } from '#resources/fetcher/utils/interceptNetworkFromPage';
import { GetlivePayload, getlivePayloadSchema, getliveResponseSchema } from './utils';
import { toFormdataBody } from '#shared/utils/formdata';
import { request } from 'undici';
import { getGame } from '#resources/store/stores/games';

/**
  流程：
  1. 晚上 12 點走一次 => 不在這裡，外面找地方弄
  2. 如果是今天的比賽，那就設定 updater
  3. 如果 isGame
  3. update 會在兩個情況關掉
    => 有 enddate, isGameStop
  4. updateor 需要變成一個狀態機才對 

*/

const GETLIVE_PLAN = `cpbl:getLiveWatcher:plan`;
const GETLIVE_START = `cpbl:getLiveWatcher:start`;
const GETLIVE_WATCHER = `cpbl:getLiveWatcher:watcher`;

async function planGetliveWatcher(context: RegisteredContext) {
  console.log('planGetliveWatcher');

  const now = Time.getNow();
  const dateStr = now.toISODate();

  console.log('dateStr', dateStr);

  const plays =
    (await getPlays(context.firestore, {
      json: true,
      refManipulate: (ref) => {
        return ref
          .where('start_datetime', '>=', dateStr)
          .where('start_datetime', '<=', dateStr + '\uf8ff')
          .orderBy('start_datetime');
      },
    })) ?? [];

  const runPlays = plays.length > 0 ? [plays[0]] : [];


  const targets = [] as { playId: string; startDt: string }[];

  runPlays.forEach(({ id: playId, startDatetime, endDatetime, result }) => {
    const startDt = Time.fromISO(startDatetime);

    console.log('play', { startDatetime, endDatetime });

    if (!startDt.isValid) {
      return;
    }

    const delay = Math.min(startDt.diffNow().toMillis(), 0);
    const job = start.createJob({ playId });

    const endDt = Time.fromISO(endDatetime ?? '');

    // 完賽
    if (endDt.isValid) {
      return
    }

    // 延賽 or 保留
    if (result === 'postponed' || result === 'suspended') {
      return
    }

    targets.push({
      startDt: startDt.toISO(),
      playId,
    });

    context.unstableQueue.queue.add(job.name, job.data, {
      ...job.opts,
      delay,
    });
  });

  return targets;
}

type StartJob = Job<{
  playId: Types.GamePlayId;
}>;

const start = {
  createJob({ playId }: StartJob['data']) {
    return {
      name: GETLIVE_START,
      data: { playId },
      opts: { deduplication: { id: `${GETLIVE_START}:${playId}` } },
    };
    // context.unstableQueue.queue.add(
  },
  name: GETLIVE_START,
  async processor(context: RegisteredContext, job: StartJob) {
    const play = await getPlay(context.firestore, job.data.playId);

    if (!play) return;
    const game = await getGame(context.firestore, play.gameId);

    if (!game) return;

    const params = new URLSearchParams({
      gameSno: String(game.seriesNo),
      year: game.year,
      kindCode: game.kind,
    });

    const siteUrl = `https://www.cpbl.com.tw/box/index?${params.toString()}`;
    const endpoint = `https://www.cpbl.com.tw/box/getlive`;

    const { [endpoint]: { request } = {} } = await intercept(siteUrl, [
      endpoint,
    ]);

    if (!request) {
      throw new Error(`${endpoint} endpoint not found`);
    }

    const formPayload = request.postData();
    const payload = Object.fromEntries(new URLSearchParams(formPayload ?? ''));

    const headers = request.headers();

    const validPayload = getlivePayloadSchema.parse(payload);

    watcher.upsertScheduler(context, {
      data: {
        headers,
        payload: validPayload,
        playId: job.data.playId,
      },
    });
  },
};



const watcher = {
  createJob({
    payload,
    headers,
    playId,
  }: {
    payload: GetlivePayload;
    headers: Record<string, string>;
    playId: Types.GamePlayId;
  }) {
    return {
      name: GETLIVE_WATCHER,
      data: {
        url: 'https://www.cpbl.com.tw/box/getlive',
        method: 'POST',
        body: toFormdataBody(payload),
        headers,
        playId,
      },
    };
  },
  name: GETLIVE_WATCHER,
  scheduleName: `${GETLIVE_WATCHER}:scheduler`,
  getScheduleName(playId: string) {
    return `${this.scheduleName}:${playId}`;
  },
  async upsertScheduler(
    context: RegisteredContext,
    {
      data,
    }: {
      data: {
        payload: GetlivePayload;
        headers: Record<string, string>;
        playId: Types.GamePlayId;
      };
    }
  ) {
    const playId = data.playId;
    if (!playId) {
      throw new Error(`invalid PlayId: ${playId}`);
    }

    const play = await getPlay(context.firestore, playId);
    const startDt = Time.fromISO(play?.startDatetime ?? '');

    if (!play) {
      throw new Error(`missing play: ${playId}`);
    }

    if (!startDt.isValid) {
      throw new Error(`invalid play startDatetime: ${playId}`);
    }

    context.unstableQueue.queue.upsertJobScheduler(
      watcher.getScheduleName(playId),
      {
        // pattern: '1 * * * *',
        every: 10000,
        tz: Time.DEFAULT_TZ,
        startDate: play.startDatetime,
      },
      this.createJob({ payload: data.payload, headers: data.headers, playId })
    );
  },
  async processor(
    context: RegisteredContext,
    job: Job<{
      url: string;
      method: string;
      body: string;
      headers: Record<string, string>;
      playId: Types.GamePlayId;
    }>
  ) {
    console.log('watcher job', job.data);

    const response = await request(job.data.url, {
      headers: job.data.headers,
      method: job.data.method,
      body: job.data.body,
    });

    const body = await response.body.json();

    const validBody = getliveResponseSchema.parse(body);

    console.log('keys', Object.keys(validBody));

    // TODO
    const isEnd = true;


    const schedulers = await context.unstableQueue.queue.getJobSchedulers(0, 9, true);

    console.log(schedulers);
    

    if (isEnd) {
      const schedulerName = watcher.getScheduleName(job.data.playId);
      console.log(schedulerName, 'end!!!!!!');

      const result = await context.unstableQueue.queue.removeJobScheduler(schedulerName);

      console.log('result', result);
      
    }
  },
};

export { planGetliveWatcher, watcher, start };
