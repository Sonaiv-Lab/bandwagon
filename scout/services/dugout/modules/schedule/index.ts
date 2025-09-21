import { Hono } from 'hono';
import { treeV0, treeV1 } from './tree';

const scheduleV0 = new Hono();

scheduleV0.route('/', treeV0);

const scheduleV1 = new Hono()

scheduleV1.route('/', treeV1);

export { scheduleV0, scheduleV1 };
