import { Hono } from 'hono';
import { getFirestore } from '#services/dugout/external/firestore';
import { getPlay, getPlays } from '#resources/store/stores/plays';
import { getGame } from '#resources/store/stores/games';

const playsV1 = new Hono();

playsV1.get('/', async (c) => {
  try {
    const firestore = await getFirestore();
    const plays = await getPlays(firestore);

    return c.json(plays);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'error';
    c.status(400);
    return c.text(errorMsg);
  }
});

playsV1.get('/:id', async (c) => {
  try {
    const playId = c.req.param('id');

    const firestore = await getFirestore();
    const play = await getPlay(firestore, playId);

    if (!play) {
      throw new Error(`play: ${playId} not found`);
    }

    const gameId = play.gameId;

    const game = await getGame(firestore, gameId);

    if (!game) {
      throw new Error(`play: get game ${gameId} not found`);
    }

    const currentPlayIndex = game.plays.indexOf(playId);

    const nextPlayId =
      currentPlayIndex + 1 < game.plays.length ? currentPlayIndex + 1 : null;

    const data = {
      ...play,
      game,
      nextPlayId,
    };

    return c.json(data);
  } catch (err) {
    if (err instanceof Error) {
      c.status(404);
      return c.text(err.message);
    }

    c.status(400);
    return c.text('error');
  }
});

export { playsV1 };
