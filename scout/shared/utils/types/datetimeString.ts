import { z } from 'zod';
import type { Branding } from './types';
import * as Time from "../time";

export type DatetimeString = Branding<string, 'DatetimeString'>;
export type NullableDatetimeString = DatetimeString | null;

const brandDatetimeString = (datetimeStr: string) => {
  return datetimeStr as DatetimeString;
};

const isoStrToDtStrSchema = (tz: string = Time.DEFAULT_TZ) => {
  return z.iso
    .datetime({ local: true })
    .refine(
      (val) => {
        const datetime = Time.fromISO(val, tz);

        return datetime.isValid;
      },
      { error: 'datetimeSchemaFactory: invalid datetime string', abort: true }
    )
    .transform((val) => {
      const datetime = Time.fromISO(val, tz) as Time.DateTime<true>;
      return createDtStrFromDt(datetime);
    });
};

export const datetimeStringSchema = z.custom<DatetimeString>((input) => {
  const { success } = z.iso
    .datetime({
      offset: true, // All the datetime in system need timezone info
    })
    .safeParse(input);

    return success;
}, 'invalid datetimeString');

export const createNullableDtStrFromIsoStr = (
  input: string,
  tz: string = Time.DEFAULT_TZ
) => {
  if (input === '') {
    return null;
  }
  const schema = isoStrToDtStrSchema(tz);

  return schema.parse(input, { reportInput: true });
};

export const createDtStrFromIsoStr = (
  input: string,
  tz: string = Time.DEFAULT_TZ
) => {
  const schema = isoStrToDtStrSchema(tz);

  return schema.parse(input, { reportInput: true });
};

export const createDtStrFromDt = (
  input: Time.DateTime,
  zone: string = Time.DEFAULT_TZ
) => {
  if (!input.isValid) {
    throw new Error('invalid datatime');
  }

  if (!Time.isValidZone(zone)) {
    throw new Error(`Invalid Timezone ${zone}`);
  }

  const datetimeIsoStr = input.setZone(zone).toISO() as string;

  return brandDatetimeString(datetimeIsoStr)
};

export const durationSecondsSchema = z.int().nonnegative();
