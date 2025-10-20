import { z } from 'zod';
import {
  GamePlayIdUnits,
  GamePlayId,
  gamePlayIdUnitsSchema,
  gamePlayIdSchema,
  gamePlayIdRuleStr,
} from './gamePlayId';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import type { HalfInning } from '#shared/model/game';

// 雖然叫 InningId，但每個 ID 其實對應到得是 HalfInning!!!!
export type InningId = string;

/**
 * @example: 2024-cpbl-A-00266__0512__09-0
 *
 * 設計概念
 * - 可以自然排序，排出自然排出局數 & 上下半局
 * - 局數用兩位數數字表示 09, 12, 11 能夠直接作 string sorting
 * - 用 0, 1 來表示上半局、下半局
 * - __ 用來區分階層
 * - 原本直接用編號，但是這樣會有日期跟 No 可能對不上的問題
 */
export type InningIdParts = {
  halfInning: HalfInning['halfInning'];
  inningNo: HalfInning['inningNo'];
  playId: GamePlayId;
};

export type InningIdUnits = Omit<InningIdParts, 'playId'> & GamePlayIdUnits;

export const inningIdUnitsSchema = z
  .object({
    ...gamePlayIdUnitsSchema.shape,
    inningNo: z
      .string()
      .regex(/\d\d/)
      .transform((inningStr) => Number(inningStr)),
    halfInning: z.enum(['1', '0']).transform((value) => {
      return (
        {
          '1': 'b',
          '0': 't',
        } as const
      )[value];
    }),
  })
  .required() satisfies SchemaFromInterface<InningIdUnits>;

export const inningIdRuleStr =
  gamePlayIdRuleStr + '__(?<inningNo>\\d{2})-(?<halfInning>[01])';

export const inningIdRule = new RegExp(`${inningIdRuleStr}$`);

export const inningIdSchema = z.string().regex(inningIdRule);

export const getInningUnitsFromId = (id: string): undefined | InningIdUnits => {
  const match = inningIdRule.exec(id);

  if (!match) return;

  const halfInningUnits = inningIdUnitsSchema.safeParse(match?.groups);

  return halfInningUnits.success ? halfInningUnits.data : undefined;
};

export const assembleInningId = ({
  playId,
  inningNo,
  halfInning,
}: InningIdParts) => {
  const validPlayId = gamePlayIdSchema.parse(playId);
  const inningStr = String(inningNo).padStart(2, '0');
  const halfInningSymbol = {
    t: '0',
    b: '1',
  }[halfInning];

  return `${validPlayId}__${inningStr}-${halfInningSymbol}`;
};
