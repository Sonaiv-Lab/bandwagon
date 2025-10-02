import type { Firestore } from '#shared/external/firestore';
import { UnstableQueue } from '#shared/external/queue/unstableQueue';

export type RegisteredContext = {
  firestore: Firestore;
  unstableQueue: UnstableQueue;
};

export type Applicable<TCall extends (...props: any[]) => any> = (
  context: RegisteredContext,
  ...props: Parameters<TCall>
) => ReturnType<TCall>;
