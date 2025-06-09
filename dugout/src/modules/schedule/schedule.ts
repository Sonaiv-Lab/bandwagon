import { Hono } from 'hono';
import { getFirestore } from '#/db/firestore';
import { pipe } from 'fp-ts/function';
import { DateTime } from 'luxon';
import * as A from 'fp-ts/Array';
import * as RR from 'fp-ts/ReadonlyRecord';

const scheduleRoute = new Hono()

scheduleRoute.get('/:year', async (c) => {
  const year = c.req.param('year');

  const firestore = await getFirestore();
  const gamesRes = await firestore
    .collection('games')
    .where('data.year', '==', year)
    .limit(5)
    .get();

  if (gamesRes.empty) {
    console.log('gggg');
  }


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

  const monoidGameArray = A.getMonoid<any>()

  const gamesByMonth = RR.fromFoldableMap(monoidGameArray, A.Foldable)(
    games,
    (game) => {
      const month = DateTime.fromISO(game.startDatetime).month.toString()
      return [month, [game]] as const
    }
  )

  return c.json(gamesByMonth)
});


export { scheduleRoute as schedule };