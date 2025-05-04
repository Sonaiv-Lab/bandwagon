import { getFirestore, Firestore } from 'firebase-admin/firestore';
import init from './init';
import env from '#/utils/env';
import { DateTime, Zone } from "luxon";

init();

const ping = async (firestore: Firestore) => {
  const timeStr = DateTime.now().setZone('Asia/Taipei').toISO()!

  await firestore
    .collection('meta')
    .doc('healthcheck')
    .collection('ping')
    .doc(timeStr)
    .set({ project: 'piggypack' });

  await firestore
    .collection('meta')
    .doc('healthcheck')
    .collection('ping')
    .doc(timeStr)
    .get();
};

const get = async () => {
  const fireStore = getFirestore(env.FIRESTORE_ID);
  await ping(fireStore);

  return fireStore;
};

export { get as getFirestore };
