import { getUnstableQueue } from './external/unstableQueue';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import env from '#shared/runtime/env';
import * as schedule from '#domains/cpblRequest/resources/schedule';
import * as box from '#domains/cpblRequest/resources/box';
import * as getLiveWatcher from '#domains/cpblRequest/resources/box/getLiveWatcher';
import { DEFAULT_TZ } from '#shared/utils/time';
import { container } from './runtime/container';

const unstableQueue = getUnstableQueue();

const app = new Hono();

// 更新賽程的 API
app.post('/schedule', async (c) => {
  const body = await c.req.json();
  const job = await schedule.addJob(
    container.context?.unstableQueue.queue!,
    body
  );

  return c.json({
    data: job.data,
    id: job.id,
    dedupId: job.opts.deduplication?.id,
    name: job.name,
  });
});

app.post('/getLiveWatcher', async (c) => {
  console.log('123123213');

  const targets = await container.apply(getLiveWatcher.planGetliveWatcher)();

  return c.json({
    targets,
  });
});

app.post('/box', async (c) => {
  const body = await c.req.json();
  const job = await box.addJob(unstableQueue, body);

  return c.json({
    data: job.data,
    dedupId: job.opts.deduplication?.id,
    id: job.id,
    name: job.name,
  });
});

app.get('/ping', (c) => {
  console.log(c.req.header());
  return c.text('pong');
});

async function main() {
  try {
    container.init();

    serve(
      {
        fetch: app.fetch,
        port: env?.LINEUP_PORT ?? 8080,
      },
      (info) => {
        console.info(
          `Lineup server is running on http://localhost:${info.port}`
        );
      }
    );

    const dailyJob = schedule.createJob({
      year: '2025',
      kindCode: 'A',
    });

    await unstableQueue.queue.upsertJobScheduler(
      'daily-schedule',
      {
        pattern: '0 0,18,19,20,21,22,23,15,12 * * *',
        tz: DEFAULT_TZ,
      },
      {
        data: dailyJob.data,
        name: dailyJob.name,
      }
    );
  } catch (err) {
    console.error(err);
  }
}

main();
