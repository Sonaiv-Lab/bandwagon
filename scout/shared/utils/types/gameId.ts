import { z } from 'zod';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';

/**
 * @example valid: 2025-cpbl-A-00001, 1995-milb-A-00354
 * @example invalid: 1995-mlb-A+-00354 (only alphabets)
 */
export const gameIdRule = new RegExp(
  /(?<year>^\d{4})-(?<level>[A-Za-z:]+)-(?<kind>[a-zA-Z]+)-(?<seriesno>\d+)$/
);

export const gameIdSchema = z.string().regex(gameIdRule);

/**
 * @param year: 比賽的年份
 * @param level: 比賽的層級，以「會一起比賽為單位」，允許大小寫英文、`:` 冒號
 * @param kind: 比賽的層級 ：e.g. 例行賽、季後賽等，允許大小寫英文
 * @param seriesno: seriesNo 比賽的序列號，各種層級的比賽有自己的序列號
 * @example: 2025-cpbl-a-25: https://www.cpbl.com.tw/box?year=2025&kindCode=A&gameSno=25
             2024-mlb-a-778251: https://www.mlb.com/gameday/padres-vs-dodgers/2024/03/21/746175/final/box
 *
 * 設計概念
 * - 可以對到世界上任何一場比賽
 * - Id 必須要簡單的文字 sort 就可以排序
 *  - 依照時間由上至下
 *  - 比賽類型之間排序
 *  - 兩個 gameId 圈出一個 range，包含 n 場比賽
 * - compatibility: 
 *  - url
 *  - backend, frontend
 *  - js, flutter, swift, kotlin, java...
*/
export type gameIdParts = {
  year: string;
  level: string;
  kind: string;
  seriesno: string;
};

export const gameIdPartsSchema =  z
.object({
  year: z.string(),
  level: z.string(),
  kind: z.string(),
  seriesno: z.string().transform((value) => value.replace(/^0+/, '')),
})
.required() satisfies SchemaFromInterface<gameIdParts>;

export const disassembleGameId = (id: string): undefined | gameIdParts => {
  const match = gameIdRule.exec(id);

  if (!match) return;

  const validation = gameIdPartsSchema.safeParse(match.groups);

  return validation.success ? validation.data : undefined;
};

export const assembleGameId = ({ year, level, kind, seriesno }: gameIdParts) => {
  return `${year}-${level}-${kind}-${seriesno.padStart(5, '0')}`;
};


