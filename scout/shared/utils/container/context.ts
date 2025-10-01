import type { Firestore } from '#shared/external/firestore';
import { UnstableQueue } from '#shared/external/queue/unstableQueue';

export type RegisteredContext = {
  firestore: Firestore;
  unstableQueue: UnstableQueue;
};
