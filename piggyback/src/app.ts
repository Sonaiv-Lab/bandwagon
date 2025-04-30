import { getGamesData } from '#/endpoints/schedule/getgamedatas';
import { upsertGame } from "#/resources/game";
import { getFirestore } from '#/resources/instances/firestore';
import { CronJob } from "cron";


const makeGamesData = async () => {
  try {
    const fireStore = getFirestore();
    
    const gamesData = await getGamesData();

    const upserts = gamesData.map((game) => {
      return upsertGame(fireStore, game)
    })

    await Promise.allSettled(upserts);

    console.log('makeGamesData: done');
  } catch (err) {
    console.log(err);
    
  }
}

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
