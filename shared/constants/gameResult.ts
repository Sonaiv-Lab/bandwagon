import { z } from 'zod';
import type { EnumSchemaFromConstRecord } from '../utils/zod';
import type { ValueOf } from '../utils/type';

const GameResultInfo = {
  pending: {
    value: '',
    label: '', // 未結束
  },
  ended: {
    value: '0',
    label: '已結束',
  },
  postponed: {
    value: '1',
    label: '延賽',
  },
  suspended: {
    value: '2',
    label: '保留',
  },
} as const;

export const GameResult = {
  pending: GameResultInfo.pending.value,
  ended: GameResultInfo.ended.value,
  postponed: GameResultInfo.postponed.value,
  suspended: GameResultInfo.suspended.value,
} as const;

export const GameResultMap = {
  '': 'pending',
  '0': 'ended',
  '1': 'postponed',
  '2': 'suspended',
} as const;

export type GameResultValue = ValueOf<typeof GameResult>;

export const gameResultValueSchema = z.enum([
  '',
  '0',
  '1',
  '2',
]) satisfies EnumSchemaFromConstRecord<typeof GameResult>;

export type GameResult = keyof typeof GameResult;

export const gameResultSchema = z.enum([
  'pending',
  'ended',
  'postponed',
  'suspended',
]) satisfies EnumSchemaFromConstRecord<typeof GameResultMap>;
