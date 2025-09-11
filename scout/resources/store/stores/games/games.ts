import {
  Firestore,
  getServerTimestamp,
  Timestamp,
} from '#shared/external/firestore';
import {
  gameDataSchema,
  GameStore,
  gameDocSchema,
  gameDocSchemaTransformed
} from './schema';
import resourceJson from './games.resource.json';
import { createFsMapFromArr, DeepPartial, GameId } from '#shared/utils/types';


// plan 階段要排序，這個階段不保證資料正確性
const COLLECTION_NAME = resourceJson.metadata.config.collectionName;

async function upsertGame(store: Firestore, gameDocument: GameStore) {
  const validGameDocument = gameDataSchema.parse(gameDocument, {
    reportInput: true,
  });

  const { id } = gameDocument;
  const doc = store.collection(COLLECTION_NAME).doc(id);
  
  const prevGame = await getGame(store, id, { metaRaw: true });

  if (!prevGame) {
    const plays = validGameDocument.plays.map((play) => {
      return {
        ...play,
        createdAt: getServerTimestamp(),
        updatedAt: getServerTimestamp(),
      };
    });

    const newDoc = {
      ...validGameDocument,
      plays: createFsMapFromArr(plays),
      updatedAt: getServerTimestamp(),
      createdAt: getServerTimestamp(),
    };

    return await doc.set(newDoc);
  }

  // 這裡也要做 createdAt 的 merge
  const plays = validGameDocument.plays.map((play) => {
    const prevPlay = (prevGame?.plays ?? []).find(
      (existedPlay) => play.id === existedPlay.id
    );

    // 這裡有問題
    if (prevPlay) {
      return {
        ...prevPlay,
        ...play,
        updatedAt: getServerTimestamp(),
      };
    }

    return {
      ...play,
      updatedAt: getServerTimestamp(),
      createdAt: getServerTimestamp(),
    };
  });

  const playsMap = createFsMapFromArr(plays);

  const newDoc = {
    ...prevGame,
    ...validGameDocument,
    plays: playsMap,
    updatedAt: getServerTimestamp(),
  };


  const res = await doc.set(newDoc);
}

async function getGame(
  store: Firestore,
  id: GameId,
  // metaData 不轉換格式，目前主要是 createAt, updatedAt 的 timestamp
  options?: { metaRaw: boolean }
) {
  const gameRef = store.collection(COLLECTION_NAME).doc(id);
  const doc = await gameRef.get();

  if (!doc.exists) {
    return;
  }

  const data = doc.data();

  const validData = options?.metaRaw
    ? gameDocSchema.parse(data)
    : gameDocSchemaTransformed.parse(data);

  return validData;
}

export { upsertGame, getGame };
