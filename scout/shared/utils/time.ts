import { DateTime, IANAZone, Settings } from 'luxon';

export const DEFAULT_TZ = 'Asia/Taipei';

Settings.defaultZone = DEFAULT_TZ;

export const fromISO = (isoStr: string, zone = DEFAULT_TZ) => {
  assertValidZone(zone)
  
  const dt = DateTime.fromISO(isoStr, { zone });

  return dt;
};

export const fromJSDate = (jsDate: Date, zone = DEFAULT_TZ) => {
  const dt = DateTime.fromJSDate(jsDate, { zone });

  return dt;
};

export const isValidZone = (zone: string) => {
  return IANAZone.isValidZone(zone);
};

const assertValidZone = (zone: string) => {
  if (!IANAZone.isValidZone(zone)) {
     throw new Error(`Invalid zone ${zone}`)
  }
}

export const fromIsoToZonedIso = (
  isoStr: string,
  zone: string = DEFAULT_TZ
) => {
  const dt = fromISO(isoStr, zone);

  return dt.isValid ? dt.toISO() : undefined
};

export type { DateTime };