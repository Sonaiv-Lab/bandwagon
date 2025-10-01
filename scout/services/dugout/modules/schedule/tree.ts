import { Hono } from 'hono';
import { pipe } from 'fp-ts/function';
import { request } from 'undici';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import {
  Game as GameV0,
  GameSeason as GameSeasonV0,
  Result as ResultV0,
} from '@bandwagon/shared/modules/game';
import { FieldOptsValue } from '@bandwagon/shared/constants/fieldOpts';
import env from '#shared/runtime/env';
import { getPlays } from '#resources/store/stores/plays';
import * as Types from '#shared/utils/types';
import * as Time from '#shared/utils/time';
import { getGames } from '#resources/store/stores/games/games';
import { Game, GamePlay } from '#shared/model/game';
import { getFirestore } from '#services/dugout/external/firestore';

/**
TODO list
- [ ] the every game in date should be sort by gameNo
- [ ] decouple the data source and the process func, accept the multi source game
*/

export type Calendar = Record<
  Types.Year,
  Record<Types.YYYYMMStr, Types.DateYYYY_MM_DD[]>
>;

export type GameSummaryV0 = {
  id: string;
  isPlayBall: boolean;

  startDatetime: Types.ISODateTimeString;
  endDatetime: Types.ISODateTimeString | null;
  year: Types.Year;
  homeTeamName: string;
  homeTeamCode: string;
  homeScore: number;
  visitingTeamName: string;
  visitingScore: number;
  visitingTeamCode: string;
  gameKindCode: string;
  gameSeason: GameSeasonV0;
  gameNo: number;
  result: ResultV0;
  field: FieldOptsValue;
};

export type DailySchedule = Record<Types.DateYYYY_MM_DD, GameSummaryV0[]>;

type TreeV0 = Record<string, Record<string, Record<string, GameSummaryV0[]>>>;

const treeV0 = new Hono();
treeV0.post('/tree/update', async (c) => {
  const baseUrl = env.PIGGYBACK_BASE_URL;
  await request(baseUrl + '/run/makeGamesData', { method: 'POST' });

  return c.text('success');
});

treeV0.get('/tree', async (c) => {
  const firestore = await getFirestore();
  const gamesRes = await firestore.collection('games').get();

  const games: TreeV0 = pipe(
    gamesRes.docs,
    A.map((game: FirebaseFirestore.QueryDocumentSnapshot) => game.data()),
    A.map(({ data }) => data as GameV0),
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
      }: GameV0): GameSummaryV0 => ({
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
      const date = Time.fromISO(startDatetime);

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
    (input: (readonly [string, string, string, GameSummaryV0])[]) => {
      const tree: TreeV0 = {};

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

type PlaySummary = {
  gameId: Game['id'];
  playId: GamePlay['id'];
  year: Game['year'];
  kind: Game['kind'];
  level: Game['level'];
  season: Game['season'];
  seriesNo: Game['seriesNo'];
  homeTeamCode: Game['homeTeamCode'];
  visitingTeamCode: Game['visitingTeamCode'];
  isGameStop: GamePlay['isGameStop'];
  isPlayBall: GamePlay['isPlayBall'];
  startDatetime: GamePlay['startDatetime'];
  endDatetime: GamePlay['endDatetime'];
  homeScore: GamePlay['homeScore'];
  visitingScore: GamePlay['visitingScore'];
  field: GamePlay['field'];
  result: GamePlay['result'];
};

const treeV1 = new Hono();

type TreeV1 = Record<string, Record<string, Record<string, PlaySummary[]>>>;

// type Tree = Record<string, Record<string, Record<string, GameSummaryV0[]>>>;

treeV1.post('/tree', async (c) => {
  const baseUrl = env.LINEUP_BASE_URL;
  await request(baseUrl + '/schedule', {
    method: 'POST',
    body: JSON.stringify({
      year: '2025',
      kindCode: 'A',
    }),
  });

  return c.text('success');
});

treeV1.get('/tree', async (c) => {
  const firestore = await getFirestore();
  const playsDoc = await getPlays(firestore, { json: true });

  const gamesDoc = await getGames(firestore, { json: true });

  if (!playsDoc) {
    throw new Error('plays not found');
  }

  if (!gamesDoc) {
    throw new Error('games not found');
  }

  const gamesRecord = gamesDoc.reduce((records, game) => {
    records[game.id] = game;
    return records;
  }, {} as Record<Types.GameId, Game>);

  const playsWithGameInfo: TreeV1 = pipe(
    playsDoc,
    A.map(
      ({
        id,
        startDatetime,
        endDatetime,
        isPlayBall,
        isGameStop,
        homeScore,
        visitingScore,
        result,
        field,
        gameId,
      }): PlaySummary => {
        const game = gamesRecord[gameId];

        return {
          playId: id,
          startDatetime,
          endDatetime,
          isPlayBall,
          year: game.year,
          homeTeamCode: game.homeTeamCode,
          homeScore,
          visitingScore,
          visitingTeamCode: game.visitingTeamCode,
          kind: game.kind,
          season: game.season,
          seriesNo: game.seriesNo,
          result,
          field,
          level: game.level,
          gameId,
          isGameStop,
        };
      }
    ),
    A.filterMap((play) => {
      const { startDatetime } = play;
      const date = Time.fromISO(startDatetime);

      if (!date.isValid) {
        return O.none;
      }

      return O.some([
        String(date.get('year')),
        date.toFormat('yyyy-MM'),
        date.toISODate(),
        play,
      ] as const);
    }),
    (input: (readonly [string, string, string, PlaySummary])[]) => {
      const tree: TreeV1 = {};

      for (const [year, month, date, games] of input) {
        tree[year] ??= {};
        tree[year][month] ??= {};
        tree[year][month][date] ??= [];

        tree[year][month][date] = tree[year][month][date].concat(games);
      }

      return tree;
    }
  );

  return c.json(playsWithGameInfo);
});

export { treeV0, treeV1 };
