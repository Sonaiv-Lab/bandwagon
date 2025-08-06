import { z } from 'zod';

/**
  the enum come from game type options in https://www.cpbl.com.tw/schedule
*/
export const FIELDS = {
  F04: {
    shortName: '台南',
    name: '台南棒球場',
    fullName: '台南市立體育棒球場',
  },
  F07: {
    shortName: '嘉義市',
    name: '嘉義棒球場',
    fullName: '嘉義市立體育棒球場',
  },
  F08: {
    shortName: '新莊',
    name: '新莊棒球場',
    fullName: '新北市市立新莊棒球場',
  },
  F09: {
    shortName: '澄清湖',
    name: '澄清湖棒球場',
    fullName: '高雄市澄清湖棒球場',
  },
  F10: {
    shortName: '天母',
    name: '臺北市立天母棒球場',
    fullName: '臺北市立天母棒球場',
  },
  F12: { shortName: '花蓮', name: '花蓮棒球場', fullName: '花蓮縣棒球場' },
  F13: { shortName: '斗六', name: '雲林棒球場', fullName: '雲林縣棒球場' },
  F17: { shortName: '台東', name: '台東棒球場', fullName: '台東縣棒球場' },
  F19: {
    shortName: '洲際',
    name: '台中洲際棒球場',
    fullName: '台中市洲際棒球場',
  },
  F23: {
    shortName: '樂天桃園',
    name: '樂天桃園棒球場',
    fullName: '樂天桃園棒球場',
  },
  F29: { shortName: '大巨蛋', name: '台北大巨蛋', fullName: '台北大巨蛋' },
} as const;

export const FIELD_OPTS = {
  全部場地: '',
  台南: 'F04',
  嘉義市: 'F07',
  新莊: 'F08',
  澄清湖: 'F09',
  天母: 'F10',
  花蓮: 'F12',
  斗六: 'F13',
  台東: 'F17',
  洲際: 'F19',
  樂天桃園: 'F23',
  大巨蛋: 'F29',
} as const;

type FieldOptsValue = (typeof FIELD_OPTS)[keyof typeof FIELD_OPTS];

const fieldOps = [...Object.values(FIELD_OPTS)];

const FieldOptsScheme = z.enum(fieldOps as [FieldOptsValue, ...FieldOptsValue[]]);

type Field = keyof typeof FIELD_OPTS;

const field = [...Object.keys(FIELD_OPTS)]

const FieldScheme = z.enum(field as [Field, ...Field[]]);

export { FieldOptsScheme, FieldScheme };

export const fieldOptsSchema = z.enum([...Object.values(FIELD_OPTS)] as [
  FieldOptsValue,
  ...FieldOptsValue[]
]);

export type { FieldOptsValue };
