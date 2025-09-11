import { Hono } from 'hono';
import { getFirestore } from '#shared/external/firestore';
import { pipe } from 'fp-ts/function';
import { DateTime } from 'luxon';
import { request } from 'undici';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import env from '#shared/runtime/env';
import { Game } from '@bandwagon/shared/modules/game';
import type { GameSummary } from '@bandwagon/shared/modules/schedule'

/**
TODO list
- [ ] the every game in date should be sort by gameNo
- [ ] decouple the data source and the process func, accept the multi source game
*/

// type GameSummary = any;

type Tree = Record<
string,
Record<string, Record<string, GameSummary[]>>
>

const tree = new Hono();
tree.post('/tree/update', async (c) => {
  const baseUrl = env.PIGGYBACK_BASE_URL
  await request(baseUrl + '/run/makeGamesData', { method: 'POST' });

  return c.text('success');
})

tree.get('/tree', async (c) => {
  const firestore = await getFirestore();
  const gamesRes = await firestore.collection('games').get();

  const games: Tree = pipe(
    gamesRes.docs,
    A.map((game: FirebaseFirestore.QueryDocumentSnapshot) => game.data()),
    A.map(({ data }) => data as Game),
    A.map(
      ({
        id,
        startDatetime,
        endDatetime,
        year,
        isPlayBall,
        homeTeamName,
        homeTeamCode,
        homeScore,
        visitingTeamName,
        visitingScore,
        visitingTeamCode,
        gameKindCode,
        gameSeason,
        gameNo,
        result,
        field,
      }: Game): GameSummary => ({
        id,
        startDatetime,
        endDatetime,
        isPlayBall,
        year,
        homeTeamName,
        homeTeamCode,
        homeScore,
        visitingTeamName,
        visitingScore,
        visitingTeamCode,
        gameKindCode,
        gameSeason,
        gameNo,
        result,
        field,
      })
    ),
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
        game,
      ] as const);
    }),
    (input: (readonly [string, string, string, GameSummary])[]) => {
      const tree: Tree = {};

      for (const [year, month, date, games] of input) {
        tree[year] ??= {};
        tree[year][month] ??= {};
        tree[year][month][date] ??= [];

        tree[year][month][date] = tree[year][month][date].concat(games);
      }

      return tree;
    }
  );

  return c.json(games);
});

export { tree };
