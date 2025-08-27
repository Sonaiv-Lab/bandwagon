import { Worker, Queue } from 'bullmq';
import { Job, Processor, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

// 這個東西應該要可以再抽出來有個 base class 才對，但目前現這樣

export class UnstableQueue {
  #connection: IORedis;
  #queue: Queue;
  #queueEvents: QueueEvents;
  #logger = console
  static name = 'unstable_queue';

  constructor() {
    this.#connection = new IORedis({ maxRetriesPerRequest: null });
    this.#queue = new Queue(UnstableQueue.name, {
      connection: this.#connection,
    });

    this.#queueEvents = this.#initQueueEvents()
  }

  #initQueueEvents = () => {
    const queueEvents = new QueueEvents(UnstableQueue.name);
    queueEvents.on('added', ({ jobId, name }) => {
      this.#logger.log(`job add: ${name} - ${jobId}`);
    });

    queueEvents.on('completed', ({ jobId, returnvalue }) => {
      this.#logger.log(`job complete: ${returnvalue} - ${jobId}`);
    });

    return queueEvents
  }
  


  get queue() {
    return this.#queue;
  }

  static createWorker(processor: Processor) {
    const connection = new IORedis({ maxRetriesPerRequest: null });
    const worker = new Worker(UnstableQueue.name, processor, { connection })

    worker.on('failed', (job: Job | undefined, error) => {
      console.log(`failed: ${job?.name} payload: ${job?.data}`);
      console.error(error)
    });
    return worker;
  }
}


export const createUnstableQueueWorker = UnstableQueue.createWorker;