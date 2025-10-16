import { z } from 'zod';

export type PlayerId = string;
export type Url = string;

export const scoreSchema = z.int().nonnegative();

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
