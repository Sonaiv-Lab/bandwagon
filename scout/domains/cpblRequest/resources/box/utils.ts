import {
  KindCodeValue,
  kindCodeSchema,
} from '@bandwagon/shared/constants/kindCode';
import * as Types from '#shared/utils/types';

import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import z from 'zod';

export type BoxPageParams = {
  year: string;
  gameSno: string;
  kindCode: KindCodeValue;
};

export type GetlivePayload = {
  __RequestVerificationToken: string;
  GameSno: string;
  KindCode: KindCodeValue;
  Year: string;
  PrevOrNext: ''; // 看起來都不代
  PresentStatus: ''; // 這個看起來也都不代
  SelectKindCode: KindCodeValue; // 都和 KindCode 一樣
  SelectYear: string; // 不知道這跟 Year 有什麼差別，反正都帶一樣的
  SelectMonth: string;
};

export const getlivePayloadSchema = z.object({
  __RequestVerificationToken: z.string(),
  GameSno: z.string(),
  KindCode: kindCodeSchema,
  Year: Types.yearStrSchema,
  PrevOrNext: z.literal(''),
  PresentStatus: z.literal(''),
  SelectKindCode: kindCodeSchema,
  SelectYear: Types.yearStrSchema,
  SelectMonth: Types.monthStrSchema,
}) satisfies SchemaFromInterface<GetlivePayload>;

/**
  ScoreboardJson: 單純紀錄記分板
  PitchingJson: 基本上是依照投手成績的區塊
  BattingJson: 依照打者成績的區塊
  GameDetailJson: 成績看板頁上面有個可以選當天不同場比賽的 tab，這裡是那邊的資料
  LiveLogJson: 文字轉播的地方
*/
export const getliveResponseSchema = z.object({
  Success: z.boolean(),
  BattingJson: z.string(),
  CurtGameDetailJson: z.string(),
  FirstSnoJson: z.string(),
  GameDetailJson: z.string(),
  LiveLogJson: z.string(),
  PitchingJson: z.string(),
  ScoreboardJson: z.string(),
  VideoJson: z.string().nullable(),
});

export const boxPageParamsSchema = z.object({
  gameSno: z.string(),
  kindCode: kindCodeSchema,
  year: Types.yearStrSchema,
}) satisfies SchemaFromInterface<BoxPageParams>;
