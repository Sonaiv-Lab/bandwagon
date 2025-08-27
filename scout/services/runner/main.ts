import { createUnstableQueueWorker } from './utils';
import * as schedule from "#domains/cpblRequest/resources/schedule";

const worker = createUnstableQueueWorker(async (job) => {
  // Will print { foo: 'bar'} for the first job
  // and { qux: 'baz' } for the second.
  console.log(job.name, job.data);

  switch (job.name) {
    case schedule.name:
    schedule.processor(job);
      break;
  
    default:
      console.error('unknown job')
      break;
  }
});
