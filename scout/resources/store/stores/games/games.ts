
import { Firestore, getServerTimestamp } from '#shared/external/firestore';
import {
  gameStoreSchema,
  GameStore,
  gameDocSchemaRaw,
  toDomain,
  toRaw,
  GameDoc,
  GameDocJson,
} from './schema';
import { metadata } from './games.resource';
import { GameId } from '#shared/utils/types';
import { merge } from '#resources/store/utils/merge';
import { FsTimestamp, fsTimestampToDt } from '#shared/external/firestore';

// plan 階段要排序，這個階段不保證資料正確性
const COLLECTION_NAME = metadata.config.collectionName;

/**
 * todo
 *
 */

const mergeGame = (base: GameStore, incoming: GameStore): GameStore => {
  return {
    id: merge(base.id, incoming.id, 'BLOCK', 'WARN'),
    year: merge(base.year, incoming.year, 'BLOCK', 'WARN'),
    homeTeamCode: merge(
      base.homeTeamCode,
      incoming.homeTeamCode,
      'BLOCK',
      'WARN'
    ),
    visitingTeamCode: merge(
      base.visitingTeamCode,
      incoming.visitingTeamCode,
      'BLOCK',
      'WARN'
    ),
    kind: merge(base.kind, incoming.kind, 'BLOCK', 'WARN'),
    season: merge(base.season, incoming.season, 'BLOCK', 'WARN'),
    seriesNo: merge(base.seriesNo, incoming.seriesNo, 'BLOCK', 'WARN'),
    level: merge(base.level, incoming.level, 'BLOCK', 'WARN'),
    plays: merge(base.plays, incoming.plays, 'ALLOW'),
  };
};

async function upsertGame(store: Firestore, gameStore: GameStore) {
  try {
    const validGameStore = gameStoreSchema.parse(gameStore, {
      reportInput: true,
      error: (issue) => {
        return `${gameStore.id}: ${issue.message}`;
      },
    });

    const { id } = gameStore;
    const doc = store.collection(COLLECTION_NAME).doc(id);

    const prevGameDoc = await getGame(store, id, { json: false });

    const newDoc = !prevGameDoc
      ? {
          ...validGameStore,
          updatedAt: getServerTimestamp(),
          createdAt: getServerTimestamp(),
        }
      : {
          ...mergeGame(prevGameDoc, validGameStore),
          createdAt: prevGameDoc.createdAt,
          updatedAt: getServerTimestamp(),
        };

    const newDocRaw = toRaw(newDoc);

    return await doc.set(newDocRaw);
  } catch (error) {
    const errorInfo = { error, data: gameStore };

    console.log(errorInfo);

    return Promise.reject(errorInfo);
  }
}

async function getGame(
  store: Firestore,
  id: GameId,
  options?: { json: true },
): Promise<GameDocJson | undefined>;
async function getGame(
  store: Firestore,
  id: GameId,
  options?: { json: false },
): Promise<GameDoc | undefined>;
async function getGame(
  store: Firestore,
  id: GameId,
  options: { json: boolean } = { json: true },
): Promise<GameDoc | GameDocJson | undefined> {
  const gameRef = store.collection(COLLECTION_NAME).doc(id);
  const doc = await gameRef.get();

  if (!doc.exists) {
    return;
  }

  const gameDocRaw = gameDocSchemaRaw.parse(doc.data());

  const gameDoc = toDomain(gameDocRaw);

  if (options.json) {
    const gameDocJson = {
      ...gameDoc,
      createdAt: fsTimestampToDt(gameDoc.createdAt),
      updatedAt: fsTimestampToDt(gameDoc.updatedAt),
    };

    return gameDocJson;
  }

  return gameDoc;
}


async function getGames(
  store: Firestore,
  options?: { json: true },
): Promise<GameDocJson[] | undefined>
async function getGames(
  store: Firestore,
  options?: { json: false},
): Promise<GameDoc[] | undefined>
async function getGames(
  store: Firestore,
  options: { json: boolean } = { json: true }
): Promise<GameDoc[] | GameDocJson[] | undefined> {
  const res = await store.collection(COLLECTION_NAME).get();

  if (options?.json) {
    const docsJson = res.docs
      .map((doc) => {
        const gameDocRaw = gameDocSchemaRaw.parse(doc.data());
        return toDomain(gameDocRaw);
      })
      .map((doc) => {
        const docJson = {
          ...doc,
          createdAt: fsTimestampToDt(doc.createdAt),
          updatedAt: fsTimestampToDt(doc.updatedAt),
        };

        return docJson;
      });

    return docsJson;
  }

  const docs = res.docs.map((doc) => {
    const docRaw = gameDocSchemaRaw.parse(doc.data());
    return toDomain(docRaw);
  });

  console.log(docs[0]);

  return docs;
}

export { upsertGame, getGame, getGames };
