import { FieldValue } from "firebase-admin/firestore";
import type { Firestore } from "@google-cloud/firestore";
import type { Game } from './types';

type GameDoc = {
  updatedAt: FieldValue,
  data: Game,
  createdAt: FieldValue
}

const getCollection = (db: Firestore) => {
  return db.collection('games');
}

// It's only simple set value logic now. But it'll contain lazy migration process in future
export const upsertGame = async (db: Firestore, game: Game) => {
  const id = game.id
  const doc = getCollection(db).doc(id);

  const docRef = await doc.get()

  const isExist = docRef.exists

  const newDoc: Partial<GameDoc> = {
    updatedAt: FieldValue.serverTimestamp(),
    data: game,
  };

  if (!isExist) {
    newDoc.createdAt = FieldValue.serverTimestamp();
  }

  // TODO 要檢查如果相同的話，就不作改動，不然會被扣錢

  console.log(`${id}: start`);

  const result = await doc.set(newDoc, { merge: true });

  console.log(`${id}: end`);

  return result;
};

