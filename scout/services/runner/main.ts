import { createUnstableQueueWorker } from './external/unstableQueue';
import * as schedule from '#domains/cpblRequest/resources/schedule';
import * as boxPage from '#domains/cpblRequest/resources/box/boxPage';
import * as getLive from '#domains/cpblRequest/resources/box/getLive';
import * as getLiveWatcher from '#domains/cpblRequest/resources/box/getLiveWatcher';
import logger from '#shared/external/logger';
import process from 'node:process';
import {
  initFirestore,
} from '#services/runner/external/firestore';

import { container } from './runtime/container';
import { Job } from 'bullmq';
import { Applicable } from '#shared/utils/container';

process.on('rejectionHandled', (code) => {
  console.log('Process exit event with code: ', code);
});

const processor = async (job: Job) => {
  const processors = [] as Applicable[];
  switch (job.name) {
    case getLiveWatcher.watcher.name:
      processors.push(getLiveWatcher.watcher.processor);
      break;
    case getLiveWatcher.start.name:
      processors.push(getLiveWatcher.start.processor);
      break;

    case schedule.name:
      processors.push(schedule.processor);
      break;

    case boxPage.name:
      processors.push(boxPage.processor);
      break;
    case getLive.name:
      processors.push(getLive.processor);
      break;
    default:
      console.error('unknown job');
  }

  try {
    if (processors.length === 1) {
      const [p] = processors;
      return await container.apply(p)(job);
    }

    const result = [];

    for (const p of processors) {
      const res = await container.apply(p)(job);
      result.push(res);
    }

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};




const init = async () => {
  try {
    await container.init();
    initFirestore();
    const worker = createUnstableQueueWorker(processor);
  } catch (err) {
    logger.warn(err);
  }
};

init();
