import { z } from 'zod';
import type { Branding } from '../types';
import { FsTimestamp } from '#shared/external/firestore';
import { DateTime, IANAZone } from 'luxon';

// 這裡的 Datetime String 在進去 Firebase 的時候會被轉成 Firebase Timestamp
// 這裡的 Datetime String 在進去 Firebase 的時候會被轉成 Firebase Timestamp
export type DatetimeString = Branding<string, 'DatetimeString'>;
export type NullableDatetimeString = DatetimeString | null;

/**
 * here is only the creator, you should use datetimeStringSchema to validate and create the DatetimeString, so keep it private
 */
function createDatetimeString(
  str: string,
  tz: string = 'Asia/Taipei'
): DatetimeString {
  const brandDatetimeString = (datetimeStr: string) => {
    return datetimeStr as DatetimeString;
  };

  const timezone = IANAZone.isValidZone(tz) ? tz : DateTime.local().zoneName;

  const datetime = DateTime.fromISO(str) as DateTime<true>;
  const datetimeIsoStr = datetime.setZone(timezone).toISO() as string;

  return brandDatetimeString(datetimeIsoStr);
}

/**
 * 這個是 input 的 schema
 */
export const datetimeWithZoneSchemaFactory = (tz?: string) => {
  return z.iso
    .datetime({ local: true })
    .refine(
      (val) => {
        const datetime = DateTime.fromISO(val);

        return datetime.isValid;
      },
      { error: 'datetimeSchemaFactory: invalid datetime string', abort: true }
    )
    .transform((val) => createDatetimeString(val, tz));
};

/**
 All the datetime in system need timezone info
*/
export const datetimeStringSchema = z.custom<DatetimeString>((input) => {
  const { success } = z.iso.datetime({ offset: true }).safeParse(input);

  return success;
}, 'invalid datetimeString');

export const createNullableDateTimeFromStr = (input: string, tz: string) => {
  if (input === '') {
    return null;
  }
  const schema = datetimeWithZoneSchemaFactory(tz);

  return schema.parse(input, { reportInput: true });
};

export const createDateTimeFromStr = (input: string, tz: string) => {
  const schema = datetimeWithZoneSchemaFactory(tz);

  return schema.parse(input, { reportInput: true });
};

export const createDtStrFromDateTime = (input: DateTime, tz: string) => {
  const brandDatetimeString = (datetimeStr: string) => {
    return datetimeStr as DatetimeString;
  };

  if (!input.isValid) {
    throw new Error('invalid datatime');
  }

  const timezone = IANAZone.isValidZone(tz) ? tz : DateTime.local().zoneName;

  const datetimeIsoStr = input.setZone(timezone).toISO() as string;

  return brandDatetimeString(datetimeIsoStr);
};

export const durationSecondsSchema = z.int().nonnegative();
