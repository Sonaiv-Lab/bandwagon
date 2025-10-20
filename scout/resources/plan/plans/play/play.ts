import { upsertPlay } from '#resources/store/stores/plays';
import { GamePlay } from '#shared/model/game';
import { RegisteredContext } from '#shared/utils/container';

/**
 * plan 是 domain model(Game) 轉換成 db entity (GameStore) 的過程（注意，不是 GameDoc）
 * 現在會很不明顯，但未來可能會有一個 model 轉換成多個 data entity 的可能性，甚至是多對多
 * （其實目前的 planGame 就是多對多？）
 */

export const planPlayMutation = (
  ctx: RegisteredContext,
  {
    plays,
  }: {
    // 這裡進來的本來就應該會有缺的資料，需要在這裡補 null 或者什麼的
    plays: GamePlay[];
  }
) => {
  const playsUpserts = plays
    .map((p) => {
      return p;
    })
    .map((p) => {
      console.log(p);
      

      return () => upsertPlay(ctx.firestore, p);
    });

  return playsUpserts;
};
