import { z } from 'zod';

export const countNumSchema = z.number().nonnegative();
export const nullableCountNumSchema = countNumSchema.nullable();
