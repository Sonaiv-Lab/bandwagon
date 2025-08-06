import { z } from 'zod';

/**
  the enum come from game type options in https://www.cpbl.com.tw/schedule
*/

const KIND_CODE = {
  一軍例行賽: 'A',
  一軍總冠軍賽: 'C',
  一軍季後挑戰賽: 'E',
  一軍熱身賽: 'G',
  一軍明星賽: 'B',
  二軍例行賽: 'D',
  二軍總冠軍賽: 'F',
  未來之星邀請賽: 'H',
  國際交流賽: 'X',
} as const;

export type KindCodeValue = (typeof KIND_CODE)[keyof typeof KIND_CODE];

const values = [...Object.values(KIND_CODE)];

export const kindCodeSchema = z.enum(
  values as [KindCodeValue, ...KindCodeValue[]]
);

export default KIND_CODE;
