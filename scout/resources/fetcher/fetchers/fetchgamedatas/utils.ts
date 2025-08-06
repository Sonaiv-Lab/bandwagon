import {
  fieldOptsSchema,
  FieldOptsValue,
} from '@bandwagon/shared/constants/fieldOpts';
import {
  kindCodeSchema as KindCodeScheme,
  KindCodeValue,
} from '@bandwagon/shared/constants/kindCode';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import type { DateYYYY_MM_DD } from '@bandwagon/shared/types/date';

import { z } from 'zod';

export const createBody = (body: getgamedatasRequestBody) => {
  GameDataRequestBodySchema.parse(body, {
    reportInput: true,
  });
  return new URLSearchParams(body).toString();
};

export type getgamedatasRequestBody = {
  calendar: DateYYYY_MM_DD;
  location: FieldOptsValue;
  kindCode: KindCodeValue;
};

export const GameDataRequestBodySchema = z
  .object({
    calendar: z.string().regex(/\d\d\d\d\/\d\d\/\d\d/), // YYYY/MM/DD
    location: fieldOptsSchema,
    kindCode: KindCodeScheme,
  })
  .required() satisfies SchemaFromInterface<getgamedatasRequestBody>;

export type GameDataResponse = {
  Success: boolean;
  GameDatas: string;
};

export const getgamedatasResponseSchema = z.object({
  Success: z.boolean(),
  GameDatas: z.string(),
}) satisfies SchemaFromInterface<GameDataResponse>;
