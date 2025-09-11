import { Hono } from 'hono';
import { getFirestore } from '#shared/external/firestore';
import { getGame } from '#resources/store/stores/games';



const gamesRoute = new Hono();

gamesRoute.get('/:id', async (c) => {
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

const gamesV1Route = new Hono();

gamesV1Route.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const firestore = await getFirestore();
    const game = getGame(firestore, id)

    if (game) {

      return c.json(game);
    }

    // TODO error handling
    c.status(400);
    return c.text('error');
  } catch (err) {
    console.error(err);

    return c.text('error');
  }
});

export { gamesRoute as games, gamesV1Route as gamesV1 };
