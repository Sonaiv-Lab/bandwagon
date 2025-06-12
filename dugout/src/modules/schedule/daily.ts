import { Hono } from 'hono';
import { getFirestore } from '#/db/firestore';
import { pipe } from 'fp-ts/function';
import { DateTime } from 'luxon';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import * as RR from 'fp-ts/ReadonlyRecord';

const daily = new Hono();

daily.get('/daily/:year', async (c) => {
  const year = c.req.param('year');

  const firestore = await getFirestore();
  const gamesRes = await firestore
    .collection('games')
    .where('data.year', '==', year)
    .get();

  const games = pipe(
    gamesRes.docs,
    A.map((game: FirebaseFirestore.QueryDocumentSnapshot) => game.data()),
    A.map(({ data }) => data),
    A.map(
      ({
        id,
        startDatetime,
        endDatetime,
        year,
        homeTeamCode,
        homeScore,
        visitingScore,
        visitingTeamCode,
        gameKindCode,
        gameSeason,
        gameNo,
      }) => ({
        id,
        startDatetime,
        endDatetime,
        year,
        homeTeamCode,
        homeScore,
        visitingScore,
        visitingTeamCode,
        gameKindCode,
        gameSeason,
        gameNo,
      })
    )
  );

  type Game = (typeof games)[number];

  const getGamesArrayMonoid = A.getMonoid<Game>();

  const gamesByDate = pipe(
    games,
    A.filterMap((game): O.Option<readonly [string, Game[]]> => {
      const date = DateTime.fromISO(game.startDatetime);

      if (!date.isValid) {
        return O.none;
      }

      return O.some([date.toISODate(), [game]] as const);
    }),
    (data) => RR.fromFoldable(getGamesArrayMonoid, A.Foldable)(data)
  );

  return c.json(gamesByDate);
});

export { daily };
