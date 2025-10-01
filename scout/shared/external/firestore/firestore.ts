import { getApps } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp, Firestore } from 'firebase-admin/firestore';
import env from '#shared/runtime/env';
import { ping, initByEnv } from '@bandwagon/shared/firestore';
import * as Time from "#shared/utils/time";
import * as Types from '#shared/utils/types';
import z from 'zod';

const getStore = async () => {
  if (!getApps().length) {
    initByEnv(env);
  }
  const fireStore = getFirestore(env.FIRESTORE_ID);

  await ping(fireStore, 'service');

  return fireStore;
};

export const createFirestore = async (serviceName: string) => {
  if (!getApps().length) {
    initByEnv(env);
  }
  const firestore = getFirestore(env.FIRESTORE_ID);

  await ping(firestore, serviceName);

  return firestore
}

export const dtToFSTimestamp = (dt: Types.DatetimeString): Timestamp => {
  return Timestamp.fromDate(Time.fromISO(dt).toJSDate());
};

export const fsTimestampToDt = (timestamp: Timestamp) => {
  return Types.createDtStrFromDt(Time.fromJSDate(timestamp.toDate()));
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
  getStore as getFirestore,
  getServerTimestamp,
  Timestamp as FsTimestamp,
  FieldValue,
  fsTimestampSchemaInput,
  fsTimestampSchemaOutput,
};

export type { ServerTimestamp };

export { Firestore } from '@google-cloud/firestore';
