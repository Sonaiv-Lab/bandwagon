import { Hono } from 'hono';
import { getFirestore } from '#/db/firestore';
import { pipe } from 'fp-ts/function';
import { DateTime } from 'luxon';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import * as RR from 'fp-ts/ReadonlyRecord';
import type { Monoid } from 'fp-ts/Monoid';

const calendar = new Hono();

calendar.get('/calendar', async (c) => {
  const firestore = await getFirestore();
  const gamesRes = await firestore.collection('games').get();

  const dedupeStringArrayMonoid: Monoid<string[]> = {
    concat: (x, y) => Array.from(new Set([...x, ...y])),
    empty: [],
  };
  const monthRecordMonoid = RR.getMonoid(dedupeStringArrayMonoid);

  const games = pipe(
    gamesRes.docs,
    A.map((game: FirebaseFirestore.QueryDocumentSnapshot) => game.data()),
    A.map(({ data }) => data),
    A.filterMap(({ startDatetime }) => {
      const date = DateTime.fromISO(startDatetime);

      if (!date.isValid) {
        return O.none;
      }

      const dates: string[] = [date.toISODate()];
      return O.some([
        String(date.get('year')),
        String(date.get('month')),
        dates,
      ] as const);
    }),
    A.map(([year, month, dates]) => {
      return [year, RR.singleton(month, dates)] as const;
    }),
    (data) => RR.fromFoldable(monthRecordMonoid, A.Foldable)(data)
  );

  return c.json(games);
});

export { calendar };
