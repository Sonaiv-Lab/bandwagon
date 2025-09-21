import { createUnstableQueueWorker } from './utils';
import * as schedule from "#domains/cpblRequest/resources/schedule";
import logger from '#shared/external/logger';
import process from "node:process";

process.on('rejectionHandled', (code) => {
  console.log('Process exit event with code: ', code);
});

const worker = createUnstableQueueWorker(async (job) => {
  // Will print { foo: 'bar'} for the first job
  // and { qux: 'baz' } for the second.
  try {
    switch (job.name) {
      case schedule.name:
      await schedule.processor(job);
        break;
    
      default:
        console.error('unknown job')
        break;
    }

  } catch (err) {
    console.log(err);
    
    logger.warn(err);
    throw err;
    
  }

});
