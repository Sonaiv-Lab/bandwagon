import { createFirestore } from '#shared/external/firestore';
import type { Firestore } from '#shared/external/firestore';
import { PROJECT_NAME } from '../runtime/config';

let firestore: Firestore;

export const initFirestore = async () => {
  firestore = await createFirestore(PROJECT_NAME);
};

export const getFirestore = () => {
  return firestore;
};
