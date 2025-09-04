import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import logger from './runtime/logger';
import { schedule, games } from '#/modules';
import env from '#/runtime/env';
import { request } from 'undici';

const app = new Hono();

app.get('/ping', async (c) => {
  return c.text('ping');
});

app.get('/scout/ping', async (c) => {
  const baseUrl = env.LINEUP_BASE_URL
  const res = await request(baseUrl + '/ping');

  const text = await res.body.text()

  return c.text(text);
});

app.route('/', schedule);
app.route('/games', games);

serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    logger.info(`Server is running on http://localhost:${info.port}`);
  }
);
