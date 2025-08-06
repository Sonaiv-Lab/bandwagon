import { z } from 'zod';

export type GameId = string;
export type GamePlayId = string;
export type PlayerId = string;
export type Year = string;
export type Url = string;

export const scoreSchema = z.int().nonnegative();
