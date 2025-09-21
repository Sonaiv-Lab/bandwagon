import { Hono } from 'hono';
import { scheduleV0, gamesV0, gamesV1, scheduleV1, playsV1 } from './modules';

export const v0Routes = new Hono();

v0Routes.route('/schedule', scheduleV0);
v0Routes.route('/games', gamesV0);

export const v1Routes = new Hono();

v1Routes.route('/schedule', scheduleV1);
v1Routes.route('/games', gamesV1);
v1Routes.route('/plays', playsV1);
