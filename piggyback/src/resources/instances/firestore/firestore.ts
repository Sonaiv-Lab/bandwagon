import { getFirestore } from 'firebase-admin/firestore';
import init from './init';
import env from "#/utils/env";

init()

const get = () => {
  return getFirestore(env.FIRESTORE_ID);
};

export { get as getFirestore };
