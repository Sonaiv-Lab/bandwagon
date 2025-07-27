import { getGamesData } from '#/endpoints/schedule/getgamedatas';
import { upsertGame } from '#/resources/game';
import { getFirestore } from '#/resources/db/firestore';
import { CronJob } from 'cron';
import logger from '#/runtime/logger';

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
      
      logger.error(`makeGamesData: ${err.message}`);
    }
  } finally {
    logger.info('=== makeGamesData end ===');
  }
};

const main = async () => {
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
