// import { Game, GamePlay } from './schema';
import { GameInfo as GameInfoInput } from '#resources/schema/schemas/game';
import {} from '#shared/utils/types';

// 既然都是一個 docuemnt...那就一起更新吧，這裡的 upsert 應該要以 Document

async function upsertGame(gameId, Game: GameInfoInput, GamePlay) {
  // 這裡等寫 plans 之後再來改
}
/** 
原本想說是不是給一個介面是直接給 GameData 然後改資料的
不對，store 的東西應該就是要 atomic，上面那個東西應應該是 plan 給的介面


所以 store 通常會包含兩個部分：mutation 跟 schema

那 GamePlay 需要有自己的 created At 跟 updated at 嗎？
那 Gameplay 改了，外面的需要改嗎 
 */
