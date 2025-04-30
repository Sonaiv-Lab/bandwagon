import { z } from 'zod';

/**
  the enum come from game type options in https://www.cpbl.com.tw/schedule
*/

const FIELD_OPTS = {
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

type FieldOpts = (typeof FIELD_OPTS)[keyof typeof FIELD_OPTS];

const fieldOps = [...Object.values(FIELD_OPTS)];

const FieldOptsScheme = z.enum(fieldOps as [FieldOpts, ...FieldOpts[]]);

type Field = keyof typeof FIELD_OPTS;

const field = [...Object.keys(FIELD_OPTS)]

const FieldScheme = z.enum(field as [Field, ...Field[]]);



export default FIELD_OPTS;
export { FieldOptsScheme, FieldScheme,  };
export type { FieldOpts, Field };
