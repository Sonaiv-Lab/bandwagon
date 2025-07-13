import { Hono } from 'hono';
import { daily } from './daily';
import { calendar } from './calendar';
import { tree } from './tree';

const schedule = new Hono().basePath('/schedule');

schedule.route('/', daily);
schedule.route('/', calendar);
schedule.route('/', tree);

export { schedule as schedule };
