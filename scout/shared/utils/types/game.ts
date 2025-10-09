import { z } from 'zod';

export type PlayerId = string;
export type Url = string;

export const scoreSchema = z.int().nonnegative();

// '1' 或者 '2'， '1' 代表上半季，'2' 代表下半季
export const gameSeasonSchema = z.enum(['1', '2']);

/*
File: shared/constants/gameResult.ts
31: export const GameResultMap
*/

export const gameResultSchema = z.enum(['', '0', '1', '2']);

export const playerIdFieldSchema = z
  .string()
  .regex(/\d{10}/)
  .or(z.literal(''));

export const nameFieldSchema = z.string().or(z.literal(''));

// 1: 代表客場, 2: 代表主場，會在勝負, mvp 等欄位出現
export const visitingHomeFieldSchema = z.enum(['1', '2']);

export const gameDateFieldSchema = z.iso.datetime({ local: true });

export const nullableGameDateFieldSchema = gameDateFieldSchema.nullable();

export const gameDuringTimeFieldSchema = z
  .string()
  .regex(/[\d+\s]/)
  .length(6)
  .or(z.literal(''));


// 把資料的 DuringTime 欄位轉換成 ms
export const transDuringTimeToMS = (hhmmss: string) => {
  const match = hhmmss.match(/(?<h>\d{2})(?<m>\d{2})(?<s>\d{2})/);

  if (!match) return 0;
  if (!match.groups?.h || !match.groups?.m || !match.groups?.s) return 0;

  const numerate = z.coerce.number();

  const hours = numerate.parse(match.groups.h);
  const minutes = numerate.parse(match.groups.m);
  const seconds = numerate.parse(match.groups.s);

  return hours * 60 * 60 + minutes * 60 + seconds;
};
