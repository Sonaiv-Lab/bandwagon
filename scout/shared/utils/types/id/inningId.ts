import { z } from 'zod';
import { GamePlayIdUnits, GamePlayId, gamePlayIdUnitsSchema, gamePlayIdSchema } from './gamePlayId';
// import { GamePlayId, gamePlayIdSchema } from './gamePlayId';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';

// 雖然叫 InningId，但每個 ID 其實對應到得是 HalfInning!!!!
export type InningId = string;


/**
 * @example: 2024-cpbl-A-00266__0512__09t
 *
 * 設計概念
 * - 局數用兩位數數字表示 09, 12, 11 能夠直接作 string sorting
 * - 用 t, b 來表示上半局、下半局
 * - __ 用來區分階層
 * - 原本直接用編號，但是這樣會有日期跟 No 可能對不上的問題
 */
export type InningIdParts = {
  halfInning: 't' | 'b';
  inning: number;
  playId: GamePlayId;
};

export type InningIdUnits = Omit<InningIdParts, 'playId'> & GamePlayIdUnits;

const gamePlayPartsSchema = z
  .object({
    year: gamePlayIdUnitsSchema.shape.year,
    level: gamePlayIdUnitsSchema.shape.level,
    kind: gamePlayIdUnitsSchema.shape.kind,
    seriesno: gamePlayIdUnitsSchema.shape.seriesno,
    mm: gamePlayIdUnitsSchema.shape.mm,
    dd: gamePlayIdUnitsSchema.shape.dd,
    inning: z
      .string()
      .regex(/\d\d/)
      .transform((inningStr) => Number(inningStr)),
    halfInning: z.enum(['t', 'b']),
  })
  .required() satisfies SchemaFromInterface<InningIdUnits>;


/**
 * @example valid: 2025-cpbl-A-00001, 1995-milb-A-00354
 * @example invalid: 1995-mlb-A+-00354 (only alphabets)
 */
export const inningIdRule = new RegExp(
  /(?<year>^\d{4})-(?<level>[A-Za-z:]+)-(?<kind>[a-zA-Z]+)-(?<seriesno>\d+)__(?<mm>\d{2})(?<dd>\d{2})__(?<inning>\d{2})(?<halfInning>[td])$/
);

export const inningIdSchema = z.string().regex(inningIdRule);


export const getInningUnitsFromId = (
  id: string
): undefined | InningIdUnits => {
  const match = inningIdRule.exec(id);

  if (!match) return;

  const validInningUnits = gamePlayPartsSchema.safeParse(match.groups);

  return validInningUnits.success ? validInningUnits.data : undefined;
};


export const assembleInningId = ({playId, inning, halfInning}: InningIdParts) => {
  const validPlayId = gamePlayIdSchema.parse(playId)
  const inningStr = String(inning).padStart(2, '0')

  return `${validPlayId}__${inningStr}${halfInning}`;
}

