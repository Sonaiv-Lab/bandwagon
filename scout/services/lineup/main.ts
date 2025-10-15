import { getUnstableQueue } from './external/unstableQueue';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import env from '#shared/runtime/env';
import * as schedule from '#domains/cpblRequest/resources/schedule';
import * as box from '#domains/cpblRequest/resources/box/boxPage';
import * as getLiveWatcher from '#domains/cpblRequest/resources/box/getLiveWatcher';
import { DEFAULT_TZ } from '#shared/utils/time';
import { container } from './runtime/container';
import { RegisteredContext } from '#shared/utils/container';
import { initOtlp } from './external/otlp';

const unstableQueue = getUnstableQueue();

const app = new Hono();

// 更新賽程的 API
app.post('/schedule', async (c) => {
  const body = await c.req.json();
  const job = await container.apply(schedule.addJob)(body)
  
  return c.json({
    data: job.data,
    id: job.id,
    dedupId: job.opts.deduplication?.id,
    name: job.name,
  });
});

app.post('/getLiveWatcher', async (c) => {
  const targets = await container.apply(getLiveWatcher.planGetliveWatcher)();

  return c.json({
    targets,
  });
});

app.post('/box', async (c) => {
  const body = await c.req.json();
  const job =  await container.apply(box.addBoxPageJob)(body);

  return c.json({
    data: job.data,
    dedupId: job.opts.deduplication?.id,
    id: job.id,
    name: job.name,
  });
});

app.get('/ping', (c) => {
  return c.text('pong');
});


const cleanupScheduler = async (ctx: RegisteredContext) => {
  const schedulers = await ctx.unstableQueue.queue.getJobSchedulers(0, 9, true);

  for (const s of schedulers) {
    const res =  await ctx.unstableQueue.queue.removeJobScheduler(s.key);

    console.log(`close scheudler: ${s.key}: ${res}`);
  }

}

async function main() {
  try {
    await container.init();
    
    initOtlp();

    await container.apply(cleanupScheduler)()

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
