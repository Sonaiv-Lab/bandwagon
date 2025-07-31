import { Hono } from 'hono';
import { tree } from './tree';

const schedule = new Hono().basePath('/schedule');

schedule.route('/', tree);

export { schedule as schedule };
