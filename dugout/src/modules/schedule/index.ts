import { Hono } from 'hono';
import { daily } from './daily';
import { calendar } from './calendar';

const schedule = new Hono().basePath('/schedule');

schedule.route('/', daily);
schedule.route('/', calendar);

export { schedule as schedule };
