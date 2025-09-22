import type { Firestore } from 'firebase-admin/firestore';
import { DateTime } from 'luxon';


export const ping = async (firestore: Firestore, project: string) => {
  const timeStr = DateTime.now().setZone('utc').toISO()!

  await firestore
    .collection('meta')
    .doc('healthcheck')
    .collection('ping')
    .doc(timeStr)
    .set({ project });

  await firestore
    .collection('meta')
    .doc('healthcheck')
    .collection('ping')
    .doc(timeStr)
    .get();
};