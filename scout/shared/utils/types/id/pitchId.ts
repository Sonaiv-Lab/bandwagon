import { z } from 'zod';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import {
  InningId,
  InningIdUnits,
  inningIdUnitsSchema,
  inningIdSchema,
  inningIdRuleStr
} from './inningId';

// 雖然叫 InningId，但每個 ID 其實對應到得是 HalfInning!!!!
export type PitchId = string;


/**
 * @example: 2024-cpbl-A-00266__0512__09-1__0001
 *
 * 設計概念
 * 延續 inning Id，加上投「第幾求」
 */
export type PitchIdParts = {
  inningId: InningId;
  // 0003, 0005 等
  pitchNo: number;
};

export type PitchIdUnits = Omit<PitchIdParts, 'inningId'> & InningIdUnits;

export const pitchIdUnitsSchema = z
  .object({
    ...inningIdUnitsSchema.shape,
    pitchNo: z
      .string()
      .regex(/\d{4}/)
      .transform((pitchNoStr) => Number(pitchNoStr)),
  })
  .required() satisfies SchemaFromInterface<PitchIdUnits>;


/**
 * @example valid: 2025-cpbl-A-00001, 1995-milb-A-00354
 * @example invalid: 1995-mlb-A+-00354 (only alphabets)
 */
export const pitchIdRuleStr =
  inningIdRuleStr + `__(?<pitchNo>\\d{5})`;

export const pitchIdRule = new RegExp(`${pitchIdRuleStr}$`);

export const pitchIdSchema = z.string().regex(pitchIdRule);


export const getUnitsFromPitchId = (
  id: string
): undefined | PitchIdUnits => {
  const match = pitchIdRule.exec(id);

  if (!match) return;

  const validPitchIdUnits = pitchIdUnitsSchema.safeParse(match.groups);

  return validPitchIdUnits.success ? validPitchIdUnits.data : undefined;
};


export const assemblePitchId = ({inningId, pitchNo}: PitchIdParts) => {
  const validInningId = inningIdSchema.parse(inningId)
  const pitchNoStr = String(pitchNo).padStart(4, '0')

  return `${validInningId}__${pitchNoStr}`;
}

