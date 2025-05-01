import { getFirestore, Firestore } from 'firebase-admin/firestore';
import init from './init';
import env from '#/utils/env';

init();

const ping = async (firestore: Firestore) => {
  await firestore
    .collection('helthcheck')
    .doc('ping')
    .set({ timestamp: new Date().toISOString() });

  await firestore.collection('helthcheck').doc('ping').get();
};

const get = async () => {
  const fireStore = getFirestore(env.FIRESTORE_ID);
  await ping(fireStore);

  return fireStore;
};

export { get as getFirestore };
