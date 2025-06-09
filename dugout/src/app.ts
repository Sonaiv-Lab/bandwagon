import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import logger from './runtime/logger';
import { getFirestore } from './db/firestore';
import { schedule, games } from "#/modules";

const app = new Hono();

app.get('/ping', async (c) => {
  return c.text('ping');
});

app.route('/schedule', schedule)
app.route('/games', games)

serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    logger.info(`Server is running on http://localhost:${info.port}`);
  }
);
