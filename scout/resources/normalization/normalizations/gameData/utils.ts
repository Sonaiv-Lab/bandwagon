import { z } from 'zod';
import { DateTime, IANAZone } from 'luxon';

export const transformDuringTime = (hhmmss: string) => {
  const match = hhmmss.match(/(?<h>\d{2})(?<m>\d{2})(?<s>\d{2})/);

  if (!match) return 0;
  if (!match.groups?.h || !match.groups?.m || !match.groups?.s) return 0;

  const numerate = z.coerce.number();

  const hours = numerate.parse(match.groups.h);
  const minutes = numerate.parse(match.groups.m);
  const seconds = numerate.parse(match.groups.s);

  return hours * 60 * 60 + minutes * 60 + seconds;
};


export const toISODatetimeWithZone = (
  isoString: string,
  tz: string
): string | null => {
  const timezone = IANAZone.isValidZone(tz) ? tz : DateTime.local().zoneName;

  const datetime = DateTime.fromISO(isoString);

  return datetime.isValid ? datetime.setZone(timezone).toISO() ?? null : null;
};
