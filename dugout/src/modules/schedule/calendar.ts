import { Hono } from 'hono';
import { getFirestore } from '#/db/firestore';
import { pipe } from 'fp-ts/function';
import { DateTime } from 'luxon';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import * as RR from 'fp-ts/ReadonlyRecord';
import type { Monoid } from 'fp-ts/Monoid';
import { Calendar } from '@bandwagon/shared/modules/schedule';
import { DateString } from '@bandwagon/shared/types';

const calendar = new Hono();

// TODO 這支 API 未來會需要加上參數，表示說有哪些 data source
calendar.get('/calendar', async (c) => {
  const firestore = await getFirestore();
  const gamesRes = await firestore.collection('games').get();

  const dedupeStringArrayMonoid: Monoid<string[]> = {
    concat: (x, y) => Array.from(new Set([...x, ...y])),
    empty: [],
  };
  const monthRecordMonoid = RR.getMonoid(dedupeStringArrayMonoid);

  const games: Calendar = pipe(
    gamesRes.docs,
    A.map((game: FirebaseFirestore.QueryDocumentSnapshot) => game.data()),
    A.map(({ data }) => {
      console.log(data);

      return data;
    }),
    A.filterMap(({ startDatetime }) => {
      const date = DateTime.fromISO(startDatetime);

      if (!date.isValid) {
        return O.none;
      }

      const dates: DateString[] = [date.toISODate()];
      return O.some([
        String(date.get('year')),
        date.toFormat('yyyy-MM'), // match the minimum format that luxon can parse to month
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
