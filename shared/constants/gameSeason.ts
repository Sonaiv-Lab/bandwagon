import { z } from 'zod';
import type { EnumSchemaFromConstRecord } from '../utils/zod';
import type { ValueOf } from '../utils/type';

const GameSeason = {
  storeTerm: '',
  singleSeason: '0',
  firstHalf: '1',
  secondHalf: '2',
} as const;

export type GameSeasonValue = ValueOf<typeof GameSeason>;

export const gameSeasonSchema = z.enum([
  '', // 短期賽，沒有分季
  '0', // 單一賽季
  '1', // 上半季
  '2', // 下半季
]) satisfies EnumSchemaFromConstRecord<typeof GameSeason>;
