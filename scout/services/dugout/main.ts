import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import logger from '#shared/external/logger';
import { logger as honoLogger } from 'hono/logger';
import { scheduleV0, gamesV0, gamesV1 } from './modules';
import env from '#shared/runtime/env';
import { request } from 'undici';
import { v0Routes, v1Routes } from './routes';
import { initFirestore } from './external/firestore';

const app = new Hono();

app.use(honoLogger());

app.get('/ping', async (c) => {
  return c.text('ping');
});

app.get('/ping/scout', async (c) => {
  const baseUrl = env.LINEUP_BASE_URL;
  const res = await request(baseUrl + '/ping');

  const text = await res.body.text();

  return c.text(text);
});

app.route('/schedule', scheduleV0);
app.route('/games', gamesV0);

app.route('/games_v1', gamesV1);

app.route('/v0', v0Routes);
app.route('/v1', v1Routes);

const init = async () => {
  await initFirestore();

  serve(
    {
      fetch: app.fetch,
      port: env?.DUGOUT_PORT ?? 8080,
      // port: env?.DUGOUT_PORT ?? 8080,
    },
    (info) => {
      logger.info(`Server is running on http://localhost:${info.port}`);
    }
  );
};

init();
