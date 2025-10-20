import {
  Firestore,
  getServerTimestamp,
} from '#shared/external/firestore';
import {
  GamePlayStore,
  playStoreSchema,
  playDocOutputSchema,
  toDoc,
  toStore,
} from './schema';
import { GamePlayId } from '#shared/utils/types';
import { merge } from '#resources/store/utils/merge';
import { GamePlay } from '#shared/model/game';
import { sortHInnings } from '#shared/utils/types/innings';

// plan 階段要排序，這個階段不保證資料正確性CC
const FS_PLAYS_COLLECTION_NAME = 'plays_v1';

type OmitMeta = Omit<GamePlayStore, 'createdAt' | 'updatedAt'>

// TODO
export const mergeInning = (
  base: OmitMeta['halfInnings'],
  incoming: OmitMeta['halfInnings']
): OmitMeta['halfInnings'] => {
  const nextInnings = structuredClone(base);

  for (const i of incoming) {
    const targetIndex = nextInnings.findIndex((t) => t.id === i.id);

    if (targetIndex >= 0) {
      nextInnings[targetIndex] = { ...nextInnings[targetIndex], ...i };
    } else {
      nextInnings.push(i);
    }
  }

  const sorted = nextInnings.sort(sortHInnings);

  return sorted;
};

export const mergePlay = (base: OmitMeta, incoming: OmitMeta): OmitMeta => {
  return {
    // 基本資訊
    id: merge(base.id, incoming.id, 'BLOCK', 'WARN'),
    gameId: merge(base.gameId, incoming.gameId, 'BLOCK', 'WARN'),
    field: merge(base.field, incoming.field, 'ALLOW'),

    // 開始日期不應該改變才對
    startDatetime: merge(
      base.startDatetime,
      incoming.startDatetime,
      'BLOCK',
      'WARN'
    ),
    endDatetime: merge(
      base.endDatetime,
      incoming.endDatetime,
      (base, income) => (!!income ? income : base),
      'INFO'
    ),

    // 比賽狀態
    result: merge(base.result, incoming.result, (base, incoming) => {
      // 只能從未開始變成其他東西
      if (incoming === 'pending') {
        return base;
      }
      return incoming;
    }),
    isGameStop: merge(
      base.isGameStop,
      incoming.isGameStop,
      'ALLOW_FLAG',
      'INFO'
    ),
    // 是不是正在比賽
    isPlayBall: merge(
      base.isPlayBall,
      incoming.isPlayBall,
      'ALLOW_FLAG',
      'INFO'
    ),

    durationSeconds: merge(
      base.durationSeconds,
      incoming.durationSeconds,
      (base, income) => (income !== 0 ? income : base)
    ),

    homeScore: merge(base.homeScore, incoming.homeScore, 'ALLOW'),
    visitingScore: merge(base.homeScore, incoming.homeScore, 'ALLOW'),
    reserveDate: merge(base.reserveDate, incoming.reserveDate, (base, income) =>
      !!income ? base : income
    ),
    audienceCount: merge(base.audienceCount, incoming.audienceCount, 'ALLOW'),

    // 球員資訊
    homePitcherId: merge(base.homePitcherId, incoming.homePitcherId, 'ALLOW'),
    homePitcherName: merge(
      base.homePitcherName,
      incoming.homePitcherName,
      'ALLOW'
    ),
    visitingPitcherId: merge(
      base.visitingPitcherId,
      incoming.visitingPitcherId,
      'ALLOW'
    ),
    visitingPitcherName: merge(
      base.visitingPitcherName,
      incoming.visitingPitcherName,
      'ALLOW'
    ),
    winningPitcherId: merge(
      base.winningPitcherId,
      incoming.winningPitcherId,
      'ALLOW'
    ),
    winningPitcherName: merge(
      base.winningPitcherName,
      incoming.winningPitcherName,
      'ALLOW'
    ),
    loserPitcherName: merge(
      base.loserPitcherName,
      incoming.loserPitcherName,
      'ALLOW'
    ),
    loserPitcherId: merge(
      base.loserPitcherId,
      incoming.loserPitcherId,
      'ALLOW'
    ),
    closerId: merge(base.closerId, incoming.closerId, 'ALLOW'),
    closerName: merge(base.closerName, incoming.closerName, 'ALLOW'),
    winningRbiHitterId: merge(
      base.winningRbiHitterId,
      incoming.winningRbiHitterId,
      'ALLOW'
    ),

    // MVP 資訊
    mvpPlayerId: merge(base.mvpPlayerId, incoming.mvpPlayerId, 'ALLOW'),
    mvpPlayerName: merge(base.mvpPlayerName, incoming.mvpPlayerName, 'ALLOW'),
    mvpCount: merge(base.mvpCount, incoming.mvpCount, 'ALLOW'),
    mvpAbCount: merge(base.mvpAbCount, incoming.mvpAbCount, 'ALLOW'),
    mvpRbiCount: merge(base.mvpRbiCount, incoming.mvpRbiCount, 'ALLOW'),
    mvpRunCount: merge(base.mvpRunCount, incoming.mvpRunCount, 'ALLOW'),
    mvpHitCount: merge(base.mvpHitCount, incoming.mvpHitCount, 'ALLOW'),
    mvpHomeRunCount: merge(
      base.mvpHomeRunCount,
      incoming.mvpHomeRunCount,
      'ALLOW'
    ),
    mvpKCount: merge(base.mvpKCount, incoming.mvpKCount, 'ALLOW'),
    mvpRaCount: merge(base.mvpRaCount, incoming.mvpRaCount, 'ALLOW'),
    mvpOutsPitchedCount: merge(
      base.mvpOutsPitchedCount,
      incoming.mvpOutsPitchedCount,
      'ALLOW'
    ),
    mvpIsVisitingTeam: merge(
      base.mvpIsVisitingTeam,
      incoming.mvpIsVisitingTeam,
      'ALLOW'
    ),

    // 裁判
    umpireHp: merge(base.umpireHp, incoming.umpireHp, 'ALLOW'),
    umpire1b: merge(base.umpire1b, incoming.umpire1b, 'ALLOW'),
    umpire2b: merge(base.umpire2b, incoming.umpire2b, 'ALLOW'),
    umpire3b: merge(base.umpire3b, incoming.umpire3b, 'ALLOW'),
    umpireLf: merge(base.umpireLf, incoming.umpireLf, 'ALLOW'),
    umpireRf: merge(base.umpireRf, incoming.umpireRf, 'ALLOW'),

    // 這裡不能直接 merge，要把各局資料並起來，然後重新 sort
    halfInnings: merge(base.halfInnings, incoming.halfInnings, mergeInning),
    source: merge(base.source, incoming.source, (a, b) => ({ ...a, ...b })),
  };
};

// 這裡吃不一定要是 store，而是 store 的 subset，但是但是，真的存進去一定要是完整的 store!!
async function upsertPlay(store: Firestore, playStore: GamePlayStore) {
  try {
    const validPlayStore = playStoreSchema.parse(playStore, {
      reportInput: true,
      error: (issue) => {
        return `${playStore.id}: ${issue.message}`;
      },
    });

    const { id } = validPlayStore;
    const target = `${FS_PLAYS_COLLECTION_NAME}:${id}`;
    const doc = store.collection(FS_PLAYS_COLLECTION_NAME).doc(id);

    const prevPlayDoc = await readPlayDoc(store, id);

    if (!prevPlayDoc) {
      const newPlayDoc = toDoc(validPlayStore, {
        updatedAt: getServerTimestamp(),
        createdAt: getServerTimestamp(),
      });

      const result = await doc.set(newPlayDoc);

      return {
        result,
        target,
      };
    }

    const prevPlayStore = toStore(prevPlayDoc)

    const mergedPlay = mergePlay(prevPlayStore, validPlayStore);

    const mergedPlayDoc = toDoc(mergedPlay, {
      createdAt: prevPlayDoc.created_at,
      updatedAt: getServerTimestamp(),
    });

    const result = await doc.set(mergedPlayDoc);

    return {
      result,
      target,
    };
  } catch (error) {
    const errorInfo = { error, data: playStore };
    console.log(errorInfo);

    return Promise.reject(errorInfo);
  }
}


const readPlayDoc = async (store: Firestore, id: GamePlayId) => {
  const playRef = store.collection(FS_PLAYS_COLLECTION_NAME).doc(id);
  const doc = await playRef.get();

  if (!doc.exists) {
    return;
  }

  const validDoc = playDocOutputSchema.parse(doc.data());
  return validDoc;
}


const assemblePlayModel = (playStore: GamePlayStore): GamePlay => {
  return playStore;
};

const loadPlayById = async (store: Firestore, id: GamePlayId) => {
  const gameDoc = await readPlayDoc(store, id);

  if (!gameDoc) return;

  const gameStore = toStore(gameDoc);

  return assemblePlayModel(gameStore);

}


type RefManipulate = (
  ref: FirebaseFirestore.CollectionReference
) => FirebaseFirestore.Query | FirebaseFirestore.CollectionReference


const loadPlays = async (
  store: Firestore,
  options?: { refManipulate: RefManipulate }
) => {
  const playsCollection = await store
    .collection(FS_PLAYS_COLLECTION_NAME)
    .get();
  const plays = playsCollection.docs
    .map((doc) => {
      const validDoc = playDocOutputSchema.parse(doc.data());
      return toStore(validDoc);
    })
    .map(assemblePlayModel);

  return plays;
};

export { upsertPlay, loadPlays, loadPlayById };
