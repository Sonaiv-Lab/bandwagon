import { getUnstableQueue } from "./utils";
import { Hono } from 'hono';
import { serve } from '@hono/node-server'
import env from '#shared/runtime/env';
import * as schedule from "#domains/cpblRequest/resources/schedule";

const unstableQueue = getUnstableQueue();

const app = new Hono();

// 更新賽程的 API
app.post('/schedule', async (c) => {
  const body = await c.req.json();
  const validJobProps = schedule.propsSchema.parse(body);

  const job = schedule.createJob(validJobProps)

  await unstableQueue.queue.addBulk([job])

  return c.json(job);
});

app.get('/ping', (c) => {
  console.log('header: ')
  console.log(c.req.header());
  
  return c.text('pong');
});



async function main() {
  try {
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

    schedule.createJob({
      year: '2025',
      kindCode: 'A',
    })

    await unstableQueue.queue.upsertJobScheduler(
      'daily-schedule',
      {
        pattern: '0 0,18,19,20,21,22,23,15,12 * * *',
    },
      schedule.createJob({
        year: '2025',
        kindCode: 'A',
      })
    );
  } catch (err) {
    console.error(err);
  }
}

main()

