import {
  Firestore,
} from '#shared/external/firestore';
import { upsertGame } from '#resources/store/stores/games';
import { GamePlayStore, upsertPlay } from '#resources/store/stores/plays';
import { GameInfo, GamePlayInfo } from '#shared/model/game';
import * as Types from "#shared/utils/types";
import {
  assembleGameId,
  assembleGamePlayId,
} from '#shared/utils/types';
import * as Time from "#shared/utils/time";
import { GameStore } from '#resources/store/stores/games/schema';

/**
  - plan 要排序
  - 建立 ID
  - 組合成 GameDocument
  - 各種資料，要怎麼 merge 進去？依靠 firestore 好像不太好啊...
  - 看一下 schema 那邊是什麼？
*/


export const planGameMutation = (
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

  return () => {
    const gamePlaysRecords = plays.reduce((records, play) => {
      const startDate = Time.fromISO(play.startDatetime);
      const playId = assembleGamePlayId({
        gameId,
        // 時區問題...
        mm: startDate.toFormat('MM'),
        dd: startDate.toFormat('dd'),
      });

      const gamePlayStore: GamePlayStore = {
        ...play,
        gameId,
        id: playId,
      };

      records[playId] = gamePlayStore;

      return records;
    }, {} as Record<Types.GamePlayId, GamePlayStore>);

    const gameStore: GameStore = {
      ...game,
      plays: Object.keys(gamePlaysRecords),
      id: gameId,
    };

    const playsUpsert = Object.values(gamePlaysRecords).map((play) => {
      return upsertPlay(store, play);
    });

    const promises = [upsertGame(store, gameStore), ...playsUpsert]

    return Promise.allSettled(promises);
  };
};
