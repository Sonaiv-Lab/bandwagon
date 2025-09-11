import { Hono } from 'hono';
import { tree } from './tree';

const schedule = new Hono();

schedule.route('/', tree);

export { schedule as schedule };
