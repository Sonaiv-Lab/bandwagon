import {
  Firestore,
} from '#shared/external/firestore';
import { GameDocument, getGame, upsertGame } from '#resources/store/stores/games';
import { GameInfo, GamePlayInfo } from '#shared/model/game';
import {
  assembleGameId,
  assembleGamePlayId,
  disassembleGamePlayId,
  GamePlayIdParts,
} from '#shared/utils/types';
import { DateTime } from 'luxon';

const useChangeNotify = <T>(base: T, incoming: T) => {
  if (String(base) !== String(incoming)) {
    // TODO should log the issue
  }
  return incoming;
};

/**
  - plan 要排序
  - 建立 ID
  - 組合成 GameDocument
  - 各種資料，要怎麼 merge 進去？依靠 firestore 好像不太好啊...

  - 看一下 schema 那邊是什麼？
*/
type PlaysOfDoc = GameDocument['plays'];
type PlayOfDoc = GameDocument['plays'][number];

const extractGamePlayUniId = (play: PlayOfDoc) => {
  // 當不同的 startDateTime，就視為不同的比賽
  // 這代表著一天不會有兩場「編號相同的比賽」，就算一天有連賽，編號也會不一樣才對
  // 目前邏輯先這樣
  return play.startDatetime;
};

const mergeGame = ({
  base,
  incoming,
}: {
  base: GameDocument;
  incoming: GameDocument;
}): Omit<GameDocument, 'plays'> => {
  return {
    id: incoming.id,
    year: useChangeNotify(base.year, incoming.year),
    homeTeamCode: useChangeNotify(base.homeTeamCode, incoming.homeTeamCode),
    visitingTeamCode: useChangeNotify(
      base.visitingTeamCode,
      incoming.visitingTeamCode
    ),
    kind: useChangeNotify(base.kind, incoming.kind),
    season: useChangeNotify(base.season, incoming.season),
    seriesNo: useChangeNotify(base.seriesNo, incoming.seriesNo),
    level: useChangeNotify(base.level, incoming.level),
  };
};

const mergePlay = (base: PlayOfDoc, incoming: PlayOfDoc): PlayOfDoc => {
  // 有點需要注意的改變

  return {
    id: incoming.id,
    isGameStop: incoming.isGameStop,
    // 是不是正在比賽
    isPlayBall: incoming.isPlayBall,
    startDatetime: useChangeNotify(base.startDatetime, incoming.startDatetime),
    endDatetime: incoming.endDatetime,
    durationSeconds:
      incoming.durationSeconds === 0
        ? base.durationSeconds
        : incoming.durationSeconds,
    field: useChangeNotify(base.field, incoming.field),
    result: incoming.result,
    homeScore: incoming.homeScore,
    visitingScore: incoming.visitingScore,
    reserveDate: incoming.reserveDate,
    visitingPitcherId: incoming.visitingPitcherId,
    visitingPitcherName: incoming.visitingPitcherName,
    homePitcherId: incoming.homePitcherId,
    homePitcherName: incoming.homePitcherName,
    winningPitcherId: incoming.winningPitcherId,
    winningPitcherName: incoming.winningPitcherName,
    loserPitcherId: incoming.loserPitcherId,
    loserPitcherName: incoming.loserPitcherName,
    closerId: incoming.closerId,
    closerName: incoming.closerName,
    mvpPlayerId: incoming.mvpPlayerId,
    mvpPlayerName: incoming.mvpPlayerName,
    mvpCount: incoming.mvpCount,
  };
};

const mergePlays = (base: PlaysOfDoc, incoming: PlaysOfDoc): PlaysOfDoc => {
  const playRecords = base.reduce((record, playOfDoc) => {
    const key = extractGamePlayUniId(playOfDoc);

    record[key] = playOfDoc;
    return record;
  }, {} as Record<PlayOfDoc['id'], PlayOfDoc>);

  // merge Data
  for (const p of incoming) {
    const key = extractGamePlayUniId(p);

    const basePlay = playRecords?.[key];
    playRecords[key] = !basePlay ? p : mergePlay(basePlay, p);
  }

  // 重給 id，因為可能有順序調換問題
  const idRealigned = Object.values(playRecords)
    .toSorted((playA, playB) => {
      const dtA = DateTime.fromISO(playA.startDatetime);
      const dtB = DateTime.fromISO(playB.startDatetime);

      if (dtA == dtB) return 0;

      return dtA > dtB ? 1 : -1;
    })
    .map((play, i) => {
      const gamePlayIdParts = disassembleGamePlayId(play.id);

      if (!gamePlayIdParts) {
        throw new Error(`invalid gameplay Id ${play.id}`);
      }

      const id = assembleGamePlayId({
        ...gamePlayIdParts,
        playno: i.toString(),
      });
      return { ...play, id };
    });

  return idRealigned;
};

const toPlaysOfDoc = (
  plays: GamePlayInfo[],
  gameIdParts: Omit<GamePlayIdParts, 'playno'>
): PlaysOfDoc => {
  return plays
    .toSorted((playA, playB) => {
      const startA = DateTime.fromISO(playA.startDatetime);
      const startB = DateTime.fromISO(playB.startDatetime);

      const { minutes } = startA.diff(startB, 'minutes');

      return minutes;
    })
    .map((play, i) => {
      const playId = assembleGamePlayId({
        ...gameIdParts,
        playno: i.toString(),
      });

      return {
        ...play,
        id: playId,
      };
    });
};

type Mutation = (store: Firestore) => Promise<unknown>;

const planGameMutation = (
  {
    game,
    plays,
  }: {
    game: GameInfo;
    plays: GamePlayInfo[];
  },
  // 不要這裡拿，去外面用 store 拿，之後可能要拿更窩更複雜的東西
  store: Firestore
) => {
  const gameId = assembleGameId({
    year: game.year,
    level: game.level,
    kind: game.kind,
    seriesno: game.seriesNo.toString(),
  });

  return async () => {
    const baseGameDoc = await getGame(store, gameId);

    const isExists = !!baseGameDoc;

    const playsToBeStored: PlaysOfDoc = toPlaysOfDoc(plays, {
      year: game.year,
      level: game.level,
      kind: game.kind,
      seriesno: game.seriesNo.toString(),
    });

    if (!isExists) {
      const gameDoc: GameDocument = {
        id: gameId,
        ...game,
        plays: playsToBeStored,
      };

      return upsertGame(store, gameDoc);
    }

    const mergedPlaysToBeStored = mergePlays(
      baseGameDoc.plays,
      playsToBeStored
    );

    const gameDoc: GameDocument = {
      id: gameId,
      ...game,
      plays: [],
    };

    const mergedGameToBeStored: GameDocument = {
      ...mergeGame({ base: baseGameDoc, incoming: gameDoc }),
      plays: mergedPlaysToBeStored,
    };

    return upsertGame(store, mergedGameToBeStored);
  };
};

export { planGameMutation };
