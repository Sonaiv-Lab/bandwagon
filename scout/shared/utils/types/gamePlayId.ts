import { z } from 'zod';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import { gameIdParts } from './gameId';

/**
 * @example valid: 2025-cpbl-A-00001, 1995-milb-A-00354
 * @example invalid: 1995-mlb-A+-00354 (only alphabets)
 */
export const gamePlayIdRule = new RegExp(
  /(?<year>^\d{4})-(?<level>[A-Za-z:]+)-(?<kind>[a-zA-Z]+)-(?<seriesno>\d+)__(?<playno>\d+)$/
);

export const gamePlayIdSchema = z.string().regex(gamePlayIdRule);

/**
 * @param playno: 實際比賽的
 * @example: 2024-cpbl-A-00266__1, 2024-cpbl-A-266__2: https://www.cpbl.com.tw/box?year=2024&kindCode=A&gameSno=266&presentStatus=0
 *
 * 設計概念
 * - 需要跟 gameId 有強烈的區別，所以不能再用 - 當 seperator
 * - __ 比起 _（single underline）更有階層關係的語意
 */
export type GamePlayIdParts = gameIdParts & {
  playno: string;
};

export const disassembleGamePlayId = (
  id: string
): undefined | GamePlayIdParts => {
  const match = gamePlayIdRule.exec(id);

  if (!match) return;

  // just simple test for type
  const schema = z
    .object({
      year: z.string(),
      level: z.string(),
      kind: z.string(),
      seriesno: z.string(),
      playno: z.string(),
    })
    .required() satisfies SchemaFromInterface<gameIdParts>;

  const validation = schema.safeParse(match.groups);

  return validation.success ? validation.data : undefined;
};

export const assembleGamePlayId = ({
  year,
  level,
  kind,
  seriesno,
  playno,
}: GamePlayIdParts) => {
  return `${year}-${level}-${kind}-${seriesno}__${playno}`;
};
