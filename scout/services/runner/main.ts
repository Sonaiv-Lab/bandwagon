import {
  createUnstableQueueWorker,
  getUnstableQueue,
} from './external/unstableQueue';
import * as schedule from '#domains/cpblRequest/resources/schedule';
import * as boxPage from '#domains/cpblRequest/resources/box/boxPage';
import * as getLive from '#domains/cpblRequest/resources/box/getLive';
import * as getLiveWatcher from '#domains/cpblRequest/resources/box/getLiveWatcher';
import logger from '#shared/external/logger';
import process from 'node:process';
import {
  getFirestore,
  initFirestore,
} from '#services/runner/external/firestore';

import { container } from './runtime/container';
import { Job } from 'bullmq';

process.on('rejectionHandled', (code) => {
  console.log('Process exit event with code: ', code);
});

const scheduleProcessor = schedule.createProcessor(getFirestore);
const boxPageProcessor = boxPage.createProcessor({
  getStore: getFirestore,
  getUnstableQueue: getUnstableQueue,
});

const processor = async (job: Job) => {
  // Will print { foo: 'bar'} for the first job
  // and { qux: 'baz' } for the second.
  console.log('job.name', job.name);
  try {
    switch (job.name) {
      case getLiveWatcher.watcher.name:
        return await container.apply(getLiveWatcher.watcher.processor)(job);

      case getLiveWatcher.start.name:
        return await container.apply(getLiveWatcher.watcher.processor)(job);

      case schedule.name:
        return await scheduleProcessor(job);

        break;

      case boxPage.name:
        return await boxPageProcessor(job);
        break;

      case getLive.name:
        return await container.apply(getLive.processor)(job) 
        break;

      default:
        console.error('unknown job');
        break;
    }
  } catch (err) {
    console.log(err);

    logger.warn(err);
    throw err;
  }
};

const init = async () => {
  container.init();
  initFirestore();
  const worker = createUnstableQueueWorker(processor);
};

init();
