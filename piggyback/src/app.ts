import { getGamesData } from '#/endpoints/schedule/getgamedatas';
import { upsertGame } from '#/resources/game';
import { getFirestore } from '#/resources/db/firestore';
import { CronJob } from 'cron';
import logger from '#/runtime/logger';
import { serve } from '@hono/node-server'
import { Hono } from "hono";
import { VERSION, NAME } from "#/runtime/config";


const makeGamesData = async () => {
  try {
    logger.info('=== makeGamesData start ===');
    const fireStore = await getFirestore();

    const gamesData = await getGamesData();

    const upserts = gamesData.map((game) => {
      return upsertGame(fireStore, game);
    });

    await Promise.allSettled(upserts);
    
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);

      const errMessage = `makeGamesData: ${err.message}`

      logger.error(errMessage);
      throw new Error(errMessage);
      
    }
  } finally {
    logger.info('=== makeGamesData end ===');
  }
};

const app = new Hono();

app.post('/run/makeGamesData', async (c) => {
  try {
    await makeGamesData();

    return c.text('success')
  } catch (err) {
    if (err instanceof Error) {
      c.text(err.message, 400);
    } else {
      c.text('unexpect error', 400);
    }
  }
});

const main = async () => {
  logger.info(`[${NAME}:${VERSION}]: start`);
  serve(
    {
      fetch: app.fetch,
    },
    (info) => {
      logger.info(`Server is running on http://localhost:${info.port}`);
    }
  );

  const makeGamesDataJob = new CronJob(
    '0 0,18,19,20,21,22,23,15,12 * * *',
    makeGamesData,
    () => {
      console.log('Running a job at 00:00 at Asia/Taipei timezone');
      // todo, make a log in future
    },
    true,
    'Asia/Taipei'
  );

  // run once when start
  makeGamesData();
};

main();
