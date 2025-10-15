import {
  Firestore,
  getServerTimestamp,
} from '#shared/external/firestore';
import {
  gameStoreSchema,
  GameStore,
  toStore,
  toDoc,
  gameDocOutputSchema,
} from './schema';
import { GameId } from '#shared/utils/types';
import { merge } from '#resources/store/utils/merge';
import { Game } from '#shared/model/game';

// plan 階段要排序，這個階段不保證資料正確性
const FS_GAMES_COLLECTION_NAME = 'games_v1';

const mergeGame = (
  base: Omit<GameStore, 'createdAt' | 'updatedAt'>,
  incoming: Omit<GameStore, 'createdAt' | 'updatedAt'>
): Omit<GameStore, 'createdAt' | 'updatedAt'> => {
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
    source: merge(base.source, incoming.source, (a, b) => ({ ...a, ...b })),
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

    const { id } = validGameStore;
    const doc = store.collection(FS_GAMES_COLLECTION_NAME).doc(id);
    const target = `${FS_GAMES_COLLECTION_NAME}:${id}`;

    const prevGameDoc = await readGameDoc(store, id);

    if (!prevGameDoc) {
      const newGameDoc = toDoc(validGameStore, {
        updatedAt: getServerTimestamp(),
        createdAt: getServerTimestamp(),
      });

      const result = await doc.set(newGameDoc);

      return {
        result,
        target,
      };
    }

    const prevGameStore = toStore(prevGameDoc);

    const mergedStore = mergeGame(prevGameStore, validGameStore);

    const mergedGameDoc = toDoc(mergedStore, {
      createdAt: prevGameDoc.created_at,
      updatedAt: getServerTimestamp(),
    });

    const result = await doc.set(mergedGameDoc);

    return {
      result,
      target,
    };
  } catch (error) {
    const errorInfo = { error, data: gameStore };

    console.log(errorInfo);

    return Promise.reject(errorInfo);
  }
}

const readGameDoc = async (store: Firestore, id: GameId) => {
  const gameRef = store.collection(FS_GAMES_COLLECTION_NAME).doc(id);
  const doc = await gameRef.get();

  if (!doc.exists) {
    return;
  }

  const validDoc = gameDocOutputSchema.parse(doc.data());

  return validDoc;
};

const assembleGameModel = (gameStore: GameStore): Game => {
  return gameStore;
};

const loadGameById = async (store: Firestore, id: GameId) => {
  const gameDoc = await readGameDoc(store, id);

  if (!gameDoc) return;

  const gameStore = toStore(gameDoc);

  return assembleGameModel(gameStore);
};

const loadGames = async  (store: Firestore ) => {
  const gameCollection = await store.collection(FS_GAMES_COLLECTION_NAME).get();
  const games = gameCollection.docs
    .map((doc) => {
      const validDoc = gameDocOutputSchema.parse(doc.data());
      return toStore(validDoc);
    })
    .map(assembleGameModel);

  return games;
}



export { upsertGame, loadGames, loadGameById };
