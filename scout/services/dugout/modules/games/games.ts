import { Hono } from 'hono';
import { getFirestore } from '#services/dugout/external/firestore';
import { loadGameById } from '#resources/store/stores/games';

const gamesV0 = new Hono();

gamesV0.get('/:id', async (c) => {
  const id = c.req.param('id');

  const firestore = await getFirestore();
  const gameRes = await firestore.collection('games').doc(id).get();

  const game = gameRes.data();

  if (game?.data) {
    return c.json(game.data);
  }

  // TODO error handling
  return c.status(400);
});

const gamesV1 = new Hono();

gamesV1.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const firestore = await getFirestore();
    const game = await loadGameById(firestore, id);

    if (!game) {
      throw new Error(`game: ${id} not found`);
    }

    return c.json(game);
  } catch (err) {
    if (err instanceof Error) {
      c.status(404);
      return c.text(err.message);
    }

    c.status(400);
    return c.text('error');
  }
});

export { gamesV0 as gamesV0, gamesV1 as gamesV1 };
