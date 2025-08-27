import { Firestore, getServerTimestamp } from '#shared/external/firestore';
import {
  gameDataSchema,
  GameStore,
  GameDocument,
  GamePlayStore,
  gameDocSchema
} from './schema';
import resourceJson from './games.resource.json';
import { createFsMapFromArr, DeepPartial, GameId } from '#shared/utils/types';

// 既然都是一個 docuemnt...那就一起更新吧，這裡的 upsert 應該要以 Document

// plan 階段要排序，這個階段不保證資料正確性
const COLLECTION_NAME = resourceJson.metadata.config.collectionName;

async function upsertGame(store: Firestore, gameDocument: GameStore) {
  const validGameDocument = gameDataSchema.parse(gameDocument, {
    reportInput: true,
  });

  const { id } = gameDocument;

  const doc = store.collection(COLLECTION_NAME).doc(id);
  const docRef = await doc.get();

  const isExist = docRef.exists;

  if (!isExist) {
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

  const plays = validGameDocument.plays.map((play) => {
    return {
      ...play,
      updatedAt: getServerTimestamp(),
    };
  });

  type A  = GameDocument['plays']

  const playsMap = createFsMapFromArr(plays)

  const newDoc = {
    ...validGameDocument,
    plays: playsMap,
    updatedAt: getServerTimestamp(),
  };

  const res = await doc.set(newDoc, { merge: true });

  console.log('upsertGame:res', res);
  
}

async function getGame(store: Firestore, id: GameId) {
  const gameRef = store.collection(COLLECTION_NAME).doc(id);
  // const gameRef = store.collection(COLLECTION_NAME).doc(id);
  const doc = await gameRef.get();

  console.log(doc);

  if (!doc.exists) {
    return;
  }

  const data  = doc.data();

  console.log('data', data);
  
  const validData = gameDocSchema.parse(data);

  return validData;
}

export { upsertGame, getGame };
