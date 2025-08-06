import { z } from 'zod';
import type { EnumSchemaFromConstRecord } from '../utils/zod';
import type { ValueOf } from '../utils/type';

const LevelsInfo = {
  cpbl: {
    value: 'cpbl',
    label: '中華職棒大聯盟一軍',
  },
  cpblm: {
    value: 'cpblm',
    label: '中華職棒大聯盟軍二軍',
  },
} as const;

const Level = {
  cpbl: LevelsInfo.cpbl.value,
  cpblm: LevelsInfo.cpblm.value,
} as const;

export type LevelValue = ValueOf<typeof Level>;

export const levelSchema = z.enum([
  'cpbl',
  'cpblm',
]) satisfies EnumSchemaFromConstRecord<typeof Level>;
