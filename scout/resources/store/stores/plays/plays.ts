import {
  Firestore,
  fsTimestampToDt,
  getServerTimestamp,
} from "#shared/external/firestore";
import {
  GamePlayDoc,
  GamePlayDocJson,
  GamePlayStore,
  playDocSchemaRaw,
  playStoreSchema,
  toDomain,
  toRaw,
} from "./schema";
import { metadata } from "./plays.resource";
import { GamePlayId } from "#shared/utils/types";
import { merge } from "#resources/store/utils/merge";

// plan 階段要排序，這個階段不保證資料正確性
const COLLECTION_NAME = metadata.config.collectionName;

const mergePlay = (
  base: GamePlayStore,
  incoming: GamePlayStore,
): GamePlayStore => {
  return {
    id: merge(base.id, incoming.id, "BLOCK", "WARN"),
    gameId: merge(base.gameId, incoming.gameId, "BLOCK", "WARN"),
    isGameStop: merge(
      base.isGameStop,
      incoming.isGameStop,
      "ALLOW_FLAG",
      "INFO",
    ),
    // 是不是正在比賽
    isPlayBall: merge(
      base.isPlayBall,
      incoming.isPlayBall,
      "ALLOW_FLAG",
      "INFO",
    ),
    // 開始日期不應該改變才對
    startDatetime: merge(
      base.startDatetime,
      incoming.startDatetime,
      "BLOCK",
      "WARN",
    ),
    endDatetime: merge(
      base.endDatetime,
      incoming.endDatetime,
      (base, income) => (!!income ? income : base),
      "INFO",
    ),
    durationSeconds: merge(
      base.durationSeconds,
      incoming.durationSeconds,
      (base, income) => {
        return income !== 0 ? income : base;
      },
    ),
    field: merge(base.field, incoming.field, "ALLOW"),
    result: merge(base.result, incoming.result, (base, incoming) => {
      // 只能從未開始變成其他東西
      if (incoming === "pending") {
        return base;
      }
      return incoming;
    }),
    homeScore: merge(base.homeScore, incoming.homeScore, "ALLOW"),
    visitingScore: merge(base.homeScore, incoming.homeScore, "ALLOW"),
    reserveDate: merge(
      base.reserveDate,
      incoming.reserveDate,
      (base, income) => !!income ? base : income,
    ),
    visitingPitcherId: merge(
      base.visitingPitcherId,
      incoming.visitingPitcherId,
      "ALLOW",
    ),
    visitingPitcherName: merge(
      base.visitingPitcherName,
      incoming.visitingPitcherName,
      "ALLOW",
    ),
    homePitcherId: merge(base.homePitcherId, incoming.homePitcherId, "ALLOW"),
    homePitcherName: merge(
      base.homePitcherName,
      incoming.homePitcherName,
      "ALLOW",
    ),
    winningPitcherId: merge(
      base.winningPitcherId,
      incoming.winningPitcherId,
      "ALLOW",
    ),
    winningPitcherName: merge(
      base.winningPitcherName,
      incoming.winningPitcherName,
      "ALLOW",
    ),
    loserPitcherId: merge(
      base.loserPitcherId,
      incoming.loserPitcherId,
      "ALLOW",
    ),
    loserPitcherName: merge(
      base.loserPitcherName,
      incoming.loserPitcherName,
      "ALLOW",
    ),
    closerId: merge(base.closerId, incoming.closerId, "ALLOW"),
    closerName: merge(base.closerName, incoming.closerName, "ALLOW"),
    mvpPlayerId: merge(base.mvpPlayerId, incoming.mvpPlayerId, "ALLOW"),
    mvpPlayerName: merge(base.mvpPlayerName, incoming.mvpPlayerName, "ALLOW"),
    mvpCount: merge(base.mvpCount, incoming.mvpCount, "ALLOW"),
  };
};

async function upsertPlay(store: Firestore, playStore: GamePlayStore) {
  try {
    const validPlayStore = playStoreSchema.parse(playStore, {
      reportInput: true,
    });

    const { id } = validPlayStore;
    const doc = store.collection(COLLECTION_NAME).doc(id);

    const prevPlayDoc = await getPlay(store, id, { json: false });

    const newDoc = !prevPlayDoc
      ? {
        ...validPlayStore,
        updatedAt: getServerTimestamp(),
        createdAt: getServerTimestamp(),
      }
      : {
        ...mergePlay(prevPlayDoc, playStore),
        createdAt: prevPlayDoc.createdAt,
        updatedAt: getServerTimestamp(),
      };

    const newDocRaw = toRaw(newDoc);

    return await doc.set(newDocRaw);
  } catch (error) {
    const errorInfo = { error, data: playStore };

    console.log(errorInfo);

    return Promise.reject(errorInfo);
  }
}

/**
 * isGetDoc表示不轉換格式，直接拿FireStore的資料，目前主要是createAt
 */
async function getPlay(
  store: Firestore,
  id: GamePlayId,
  options?: { json: true },
): Promise<GamePlayDocJson | undefined>;
async function getPlay(
  store: Firestore,
  id: GamePlayId,
  options?: { json: false },
): Promise<GamePlayDoc | undefined>;
async function getPlay(
  store: Firestore,
  id: GamePlayId,
  options: { json: boolean } = { json: true },
): Promise<GamePlayDoc | GamePlayDocJson | undefined> {
  const playRef = store.collection(COLLECTION_NAME).doc(id);
  const doc = await playRef.get();

  if (!doc.exists) {
    return;
  }


  const playDocRaw = playDocSchemaRaw.parse(doc.data());

  const playDoc = toDomain(playDocRaw);

  if (options?.json) {
    const playDocJson: GamePlayDocJson = {
      ...playDoc,
      createdAt: fsTimestampToDt(playDoc.createdAt),
      updatedAt: fsTimestampToDt(playDoc.updatedAt),
    };

    return playDocJson;
  }

  return playDoc;
}

async function getPlays(
  store: Firestore,
  options?: { json: true },
): Promise<GamePlayDocJson[] | undefined>
async function getPlays(
  store: Firestore,
  options?: { json: false},
): Promise<GamePlayDoc[] | undefined>
async function getPlays(
  store: Firestore,
  options: { json: boolean } = { json: true }
): Promise<GamePlayDoc[] | GamePlayDocJson[] | undefined> {
  const playsRes = await store.collection(COLLECTION_NAME).get();

  if (options?.json) {
    const playDocsJson = playsRes.docs
      .map((doc) => {
        const playDocRaw = playDocSchemaRaw.parse(doc.data());
        return toDomain(playDocRaw);
      })
      .map((playDoc) => {
        const playDocJson = {
          ...playDoc,
          createdAt: fsTimestampToDt(playDoc.createdAt),
          updatedAt: fsTimestampToDt(playDoc.updatedAt),
        };

        return playDocJson;
      });

    return playDocsJson;
  }

  const playDocs = playsRes.docs.map((doc) => {
    const playDocRaw = playDocSchemaRaw.parse(doc.data());
    return toDomain(playDocRaw);
  });

  console.log(playDocs[0]);

  return playDocs;
}
export { getPlay, getPlays, upsertPlay };
