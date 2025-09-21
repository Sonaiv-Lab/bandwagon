import { getApps } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import env from '#shared/runtime/env';
import { ping, initByEnv } from '@bandwagon/shared/firestore';
import { DatetimeString } from '#shared/utils/types';
import { DateTime } from 'luxon';
import { createDtStrFromDateTime } from '#shared/utils/types';
import z from 'zod';

// import logger from '#/runtime/logger';

const get = async () => {
  const apps = getApps();

  if (!getApps().length) {
    initByEnv(env);
  }
  const fireStore = getFirestore(env.FIRESTORE_ID);

  await ping(fireStore, 'piggyback');

  return fireStore;
};

export const dtToFSTimestamp = (dt: DatetimeString): Timestamp => {
  return Timestamp.fromDate(DateTime.fromISO(dt).toJSDate());
};

export const fsTimestampToDt = (timestamp: Timestamp) => {
  return createDtStrFromDateTime(
    DateTime.fromJSDate(timestamp.toDate()),
    'Asia/Taipei'
  );
};

const getServerTimestamp = FieldValue.serverTimestamp;

type ServerTimestamp = ReturnType<typeof getServerTimestamp>;

const fsTimestampSchemaOutput = z.instanceof(Timestamp);

const fsTimestampSchemaInput = z.instanceof(Timestamp).or(
  z.custom<FieldValue>((val) => val instanceof FieldValue, {
    message: 'Not a Firestore FieldValue',
  })
);

export {
  get as getFirestore,
  getServerTimestamp,
  Timestamp as FsTimestamp,
  FieldValue,
  fsTimestampSchemaInput,
  fsTimestampSchemaOutput,
};

export type { ServerTimestamp };

export { Firestore } from '@google-cloud/firestore';
