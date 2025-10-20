import { z } from 'zod';
import * as Types from '#shared/utils/types';
import * as Consts from '@bandwagon/shared/constants';

export const scoreSchema = z.int().nonnegative();

export const teamCodeSchema = Consts.teamCodeSchema

// '1' 或者 '2'， '1' 代表上半季，'2' 代表下半季, 0 代表不分季
export const gameSeasonFieldSchema = z.enum(['1', '2', '0']);
export const gameResultFieldSchema = z.enum(['', '0', '1', '2']);

export const playerIdFieldSchema = z.string().regex(/\d{10}/);
export const playerIdFieldSchemaNullable = playerIdFieldSchema.or(
  z.literal('')
);

export const nameFieldSchema = z.string();
export const nameFieldSchemaNullable = nameFieldSchema.or(z.literal(''));

// 1: 代表客場, 2: 代表主場，會在勝負, mvp 等欄位出現
export const visitingHomeFieldSchema = z.enum(['1', '2']);
export const visitingHomeFieldSchemaNullable = z
  .enum(['1', '2'])
  .or(z.literal(''));

export const gameDuringTimeFieldSchema = z
  .string()
  .regex(/[\d+\s]/)
  .length(6);

export const gameDuringTimeFieldSchemaNullable =
  gameDuringTimeFieldSchema.or(z.literal(''));

export const yearFieldSchema = Types.yearStrSchema;

export const fieldNoFieldSchema = Consts.fieldOptsSchema;
export const defendStationFieldSchema = Consts.defensePosAbbrevCodeSchema;
export const defensePosRecordCodeSchema = Consts.defensePosRecordCodeSchema;
export const kindCodefieldSchema = Consts.kindCodeSchema;

export const eventNoRules = /(?<inningNo>\d{2})(?<halfInning>[12]{1})(?<pitchNo>\d{4})(?<rest>\d{3})/

export const eventNoFieldSchema = z
  .string()
  .regex(eventNoRules);
export const eventNoFieldSchemaNullable = eventNoFieldSchema.or(z.string(''));

export const dateFieldSchema = z.iso.datetime({ local: true });

export const dateFieldSchemaNullable = dateFieldSchema.nullable();
export const countFieldSchema = z.number().nonnegative();
export const countFieldSchemaNullable = z.number().nonnegative().nullable();

export const boolFieldSchema = z.enum(['1', '0']);

export const seriesNoFieldSchema = z.number();

export const urlPathSchema = z.string()

