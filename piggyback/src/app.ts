import { getGamesData } from '#/endpoints/schedule/getgamedatas';
import { upsertGame } from '#/resources/game';
import { getFirestore } from '#/resources/instances/firestore';
import { CronJob } from 'cron';
import logger from '#/utils/logger';

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
      logger.error(`makeGamesData: ${err.message}`);
    }
  } finally {
    logger.info('=== makeGamesData end ===');
  }
};

const main = async () => {
  const makeGamesDataJob = new CronJob(
    '0 0 * * 2-7',
    makeGamesData,
    () => {
      console.log('makeGamesData: done');
      // todo, make a log in future
    },
    true,
    'Asia/Taipei'
  );
  makeGamesData();
};

main();
