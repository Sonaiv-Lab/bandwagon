import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import env from '#/runtime/env';
import { ping, initByEnv } from '@bandwagon/utils/firestore';
import { PROJECT_NAME } from "#/runtime/config";

let firestoreApp: Firestore;

const get = async () => {
  
  if (!firestoreApp) {
    initByEnv(env);
    firestoreApp = getFirestore(env.FIRESTORE_ID);
    await ping(firestoreApp, PROJECT_NAME);
  }

  return firestoreApp;
};

export { get as getFirestore };
