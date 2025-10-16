import { z } from 'zod';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import { GameId, gameIdSchema, gameIdUnitsSchema, GameIdUnits, gameIdRuleStr } from './gameId';
import { DateTime } from 'luxon';

export type GamePlayId = string;

/**
 * @example valid: 2025-cpbl-A-00001__0421, 1995-milb-A-00354__0422
 */
export const gamePlayIdRuleStr = gameIdRuleStr + '__(?<mm>\\d{2})(?<dd>\\d{2})'
export const gamePlayIdRule = new RegExp(`${gamePlayIdRuleStr}$`);

export const gamePlayIdSchema = z.string().regex(gamePlayIdRule);

/**
 * @example: 2024-cpbl-A-00266__0512, 2024-cpbl-A-266__0623: https://www.cpbl.com.tw/box?year=2024&kindCode=A&gameSno=266&presentStatus=0
 *
 * 設計概念
 * - 需要跟 gameId 有強烈的區別，所以不能再用 - 當 seperator
 * - __ 比起 _（single underline）更有階層關係的語意
 * - 原本直接用編號，但是這樣會有日期跟 No 可能對不上的問題
 */
export type GamePlayIdParts = {
  gameId: GameId;
  mm: string;
  dd: string;
};

export type GamePlayIdUnits = Omit<GamePlayIdParts, 'gameId'> & GameIdUnits;

export const gamePlayIdUnitsSchema = z
  .object({
    ...gameIdUnitsSchema.shape,
    mm: z.string().length(2),
    dd: z.string().length(2),
  })
  .required() satisfies SchemaFromInterface<GamePlayIdUnits>;

export const getPlayUnitsFromId = (
  id: string
): undefined | GamePlayIdUnits => {
  const match = gamePlayIdRule.exec(id);

  if (!match) return;

  const validation = gamePlayIdUnitsSchema.safeParse(match.groups);

  return validation.success ? validation.data : undefined;
};

export const assembleGamePlayId = ({
  gameId,
  datetime,
}: {
  gameId: GameId;
  datetime: DateTime;
}): GamePlayId => {
  if (!datetime.isValid) {
    throw new Error('assembleGamePlayId: invalid datetime');
  }

  const mm = datetime.toFormat('MM');
  const dd = datetime.toFormat('dd');

  const valueGameId = gameIdSchema.parse(gameId);

  return `${valueGameId}__${mm}${dd}`;
};
