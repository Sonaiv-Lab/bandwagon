import z from "zod";

export type Year = string; // YYYY
export type YYYYMMStr = string; // YYYY-MM
export type DateYYYY_MM_DD = string; // YYYY-MM-DD
export type ISODateTimeString = string;

export const yearStrSchema = z.string().regex(/\d\d\d\d/);
export const monthStrSchema = z.string().refine((input) => {
  const numMonth = Number(input);

  return !Number.isNaN(numMonth) && numMonth >= 1 && numMonth <= 12
}, {error: 'invalid month string'});
