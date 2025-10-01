import { UnstableQueue } from '#shared/external/queue/unstableQueue';

let queue: UnstableQueue;

export const getUnstableQueue = () => {
  if (!queue) {
    queue = new UnstableQueue();
  }

  return queue;
};


export const createUnstableQueueWorker = UnstableQueue.createWorker;

export { UnstableQueue };