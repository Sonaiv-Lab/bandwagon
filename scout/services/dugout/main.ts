import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import logger from './runtime/logger';
import { logger as honoLogger } from 'hono/logger';
import { schedule, games, gamesV1 } from './modules';
import env from '#shared/runtime/env';
import { request } from 'undici';

const app = new Hono();

app.use(honoLogger());

app.get('/ping', async (c) => {
  return c.text('ping');
});

app.get('/scout/ping', async (c) => {
  const baseUrl = env.LINEUP_BASE_URL;
  const res = await request(baseUrl + '/ping');

  const text = await res.body.text();

  return c.text(text);
});

app.route('/schedule', schedule);
app.route('/games', games);

app.route('/games_v1', gamesV1);

serve(
  {
    fetch: app.fetch,
    port: env?.DUGOUT_PORT ?? 8080,
  },
  (info) => {
    logger.info(`Server is running on http://localhost:${info.port}`);
  }
);
