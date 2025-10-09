import { z } from 'zod';

/**
 * @example 0000004633 => 陳晨威
 */
export const cpblPlayerIdSchema = z.string().regex(/\d{10}/);
export const nameSchema = z.string().nonempty();
