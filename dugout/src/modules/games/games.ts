import { Hono } from 'hono';
import { getFirestore } from '#/db/firestore';

const gamesRoute = new Hono()

gamesRoute.get('/:id', async (c) => {
  const id = c.req.param('id');

  const firestore = await getFirestore();
  const gameRes = await firestore
    .collection('games')
    .doc(id)
    .get()
  
  const game = gameRes.data()

  if (game?.data) {
    return c.json(game.data);  
  }

  // TODO error handling
  c.status(400)
})

export { gamesRoute as games };