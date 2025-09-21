import { z } from 'zod';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import { gameIdParts, gameIdSchema } from './gameId';
import { GamePlayId, GameId } from './game';

/**
 * @example valid: 2025-cpbl-A-00001, 1995-milb-A-00354
 * @example invalid: 1995-mlb-A+-00354 (only alphabets)
 */
export const gamePlayIdRule = new RegExp(
  /(?<year>^\d{4})-(?<level>[A-Za-z:]+)-(?<kind>[a-zA-Z]+)-(?<seriesno>\d+)__(?<mm>\d{2})(?<dd>\d{2})$/
);

export const gamePlayIdSchema = z.string().regex(gamePlayIdRule);

/**
 * @param playno: 實際比賽的
 * @example: 2024-cpbl-A-00266__0512, 2024-cpbl-A-266__0623: https://www.cpbl.com.tw/box?year=2024&kindCode=A&gameSno=266&presentStatus=0
 *
 * 設計概念
 * - 需要跟 gameId 有強烈的區別，所以不能再用 - 當 seperator
 * - __ 比起 _（single underline）更有階層關係的語意
 * - 原本直接用編號，但是這樣會有日期跟 No 可能對不上的問題
 */
export type GamePlayIdParts = {
  gameId: GameId
  mm: string,
  dd: string
};

const gamePlayPartsSchema = z.object({
  gameId: gameIdSchema,
  mm: z.string(),
  dd: z.string(),
})
.required() satisfies SchemaFromInterface<GamePlayIdParts>;

export const disassembleGamePlayId = (
  id: string
): undefined | GamePlayIdParts => {
  const match = gamePlayIdRule.exec(id);

  if (!match) return;

  const validation = gamePlayPartsSchema.safeParse(match.groups);

  return validation.success ? validation.data : undefined;
};

export const assembleGamePlayId = (parts: GamePlayIdParts): GamePlayId => {
  const { gameId, mm, dd } = gamePlayPartsSchema.parse(parts);

  return `${gameId}__${mm}${dd}`;
};
