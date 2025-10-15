import { Worker, Queue } from 'bullmq';
import { Job, Processor, QueueEvents } from 'bullmq';
import env from '#shared/runtime/env';
import IORedis from 'ioredis';
import { BullMQOtel } from 'bullmq-otel';

// 這個東西應該要可以再抽出來有個 base class 才對，但目前現這樣

export class UnstableQueue {
  #connection: IORedis;
  #queue: Queue;
  #queueEvents: QueueEvents;
  #logger = console;
  static name = 'unstable_queue';

  constructor() {
    this.#connection = new IORedis({
      maxRetriesPerRequest: null,
      host: env.REDIS_HOST,
    });

    this.#connection.ping().then((res) => {
      console.log(`Redis reply: ${res}`);
    }).catch((err) => {
      console.log(`Redis err: ${err}`);
    })

    this.#connection.on('ready', () => {
      console.log('Redis is ready to use');
    })

    this.#queue = new Queue(UnstableQueue.name, {
      connection: this.#connection,
      telemetry: new BullMQOtel(UnstableQueue.name)
    });

    this.#queueEvents = this.#initQueueEvents();
  }

  #initQueueEvents = () => {
    const queueEvents = new QueueEvents(UnstableQueue.name, {
      connection: this.#connection,
    });
    queueEvents.on('added', ({ jobId, name }) => {
      this.#logger.log(`[queue]job add: ${name} - ${jobId}`);
    });

    queueEvents.on('completed', ({ jobId, returnvalue }) => {
      this.#logger.log(`[queue] job complete: ${returnvalue} - ${jobId}`);
    });

    return queueEvents;
  };

  get queue() {
    return this.#queue;
  }

  static createWorker(processor: Processor) {
  
    const connection = new IORedis({
      maxRetriesPerRequest: null,
      host: env.REDIS_HOST,
    });
    const worker = new Worker(UnstableQueue.name, processor, {
      name: 'unstable_queue:worker',
      connection,
      telemetry: new BullMQOtel(UnstableQueue.name)
    });

    worker.on('failed', (job: Job | undefined, error) => {
      console.log(`failed: ${job?.name} payload: ${job?.data}`);
      console.error(error);
    });

    worker.on('error', (err) => {
      console.error(err);
    });
    worker.on('completed', (job) => {
      console.log(`[worker]${job.name}: compete`);
      
    });
    worker.on('active', (job) => {
      console.log(`[worker]${job.name}: active`);
      
    });
    return worker;
  }
}

export const createUnstableQueueWorker = UnstableQueue.createWorker;
