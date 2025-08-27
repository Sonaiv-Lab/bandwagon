import { getApps } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import env from '#shared/runtime/env';
import { ping, initByEnv } from '@bandwagon/shared/firestore';
import { DatetimeString } from '#shared/utils/types';
import { DateTime } from 'luxon';

// import logger from '#/runtime/logger';

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

export const toFirestoreTimestamp = (dt: DatetimeString): Timestamp => {
  return Timestamp.fromDate(DateTime.fromISO(dt).toJSDate());
};

const getServerTimestamp = FieldValue.serverTimestamp;

type ServerTimestamp = ReturnType<typeof getServerTimestamp>;

export { get as getFirestore, getServerTimestamp };

export type { ServerTimestamp };

export { Firestore, Timestamp } from '@google-cloud/firestore';
