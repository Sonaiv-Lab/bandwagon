import { getFirestore } from 'firebase-admin/firestore';
import env from '#/utils/env';
import { ping, initByEnv} from '@bandwagon/utils/firestore';

const get = async () => {
  initByEnv(env)
  const fireStore = getFirestore(env.FIRESTORE_ID);
  await ping(fireStore, 'piggyback')

  return fireStore;
};

export { get as getFirestore };
