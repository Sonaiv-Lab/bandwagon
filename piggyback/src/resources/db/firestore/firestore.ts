import { getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import env from '#/runtime/env';
import { ping, initByEnv } from '@bandwagon/shared/firestore';
import type { Firestore } from '@google-cloud/firestore';
import logger from '#/runtime/logger';

const get = async () => {
  const apps = getApps();

  if (!getApps().length) {
    initByEnv(env);
  }
  console.log(apps);
  const fireStore = getFirestore(env.FIRESTORE_ID);

  await ping(fireStore, 'piggyback');

  return fireStore;
};

export { get as getFirestore };
