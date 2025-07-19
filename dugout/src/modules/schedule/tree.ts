import { Hono } from 'hono';
import { getFirestore } from '#/db/firestore';
import { pipe } from 'fp-ts/function';
import { DateTime } from 'luxon';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import type { Monoid } from 'fp-ts/Monoid';

/**
TODO list
- [ ] the every game in date should be sort by gameNo
- [ ] decouple the data source and the process func, accept the multi source game
*/

// TODO replace to correct type
type GameSummary = any;

type Tree = Record<
string,
Record<string, Record<string, GameSummary[]>>
>

const tree = new Hono();

tree.get('/tree', async (c) => {
  const firestore = await getFirestore();
  const gamesRes = await firestore.collection('games').get();

  const games: Tree = pipe(
    gamesRes.docs,
    A.map((game: FirebaseFirestore.QueryDocumentSnapshot) => game.data()),
    A.map(({ data }) => {

      return data;
    }),
    A.filterMap((game) => {
      const { startDatetime } = game;
      const date = DateTime.fromISO(startDatetime);

      if (!date.isValid) {
        return O.none;
      }

      return O.some([
        String(date.get('year')),
        date.toFormat('yyyy-MM'),
        date.toISODate(),
        [game] satisfies GameSummary[],
      ] as const);
    }),
    (input: (readonly [string, string, string, GameSummary])[]) => {
      const tree: Tree = {};

      for (const [year, month, date, games] of input) {
        tree[year] ??= {};
        tree[year][month] ??= {};
        tree[year][month][date] ??= [];

        tree[year][month][date] = tree[year][month][date].concat(games)
      }

      return tree;
    }
  );

  return c.json(games);
});

export { tree };
