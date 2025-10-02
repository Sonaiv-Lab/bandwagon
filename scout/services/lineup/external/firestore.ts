import { createFirestore } from '#shared/external/firestore';
import type { Firestore } from '#shared/external/firestore';
import { PROJECT_NAME } from '../runtime/config';

let firestore: Firestore;

export const initFirestore = async () => {
  if (!firestore) {
    firestore = await createFirestore(PROJECT_NAME);
  }

  return firestore;
};

export const getFirestore = () => {
  return firestore;
};
