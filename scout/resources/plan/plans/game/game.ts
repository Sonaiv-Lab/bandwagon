import { Firestore } from '#shared/external/firestore';
import { upsertGame } from '#resources/store/stores/games';
import { GamePlayStore, upsertPlay } from '#resources/store/stores/plays';
import { GameWithoutPlays, GamePlay } from '#shared/model/game';

import * as Types from '#shared/utils/types';
import { GameStore } from '#resources/store/stores/games/schema';

/**
  * plan 是 domain model(Game) 轉換成 db entity (GameStore) 的過程（注意，不是 GameDoc）
  * 現在會很不明顯，但未來可能會有一個 model 轉換成多個 data entity 的可能性，甚至是多對多
  * （其實目前的 planGame 就是多對多？）
*/

export const planGameMutation = (
  {
    game,
    plays,
  }: {
    game: GameWithoutPlays;
    // 這裡進來的本來就應該會有缺的資料，需要在這裡補 null 或者什麼的
    plays: GamePlay[];
  },
  // 不要這裡拿，去外面用 store 拿，之後可能要拿更窩更複雜的東西
  store: Firestore
) => {
  const gameId = game.id;

  return () => {
    const gamePlaysRecords = plays.reduce((records, play) => {
      const playId = play.id;

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

    const promises = [upsertGame(store, gameStore), ...playsUpsert];

    return promises;
  };
};
