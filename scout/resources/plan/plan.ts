import { Metadata, Resource } from '#shared/resource';
import { AnyFunctionWithReturn } from '#shared/utils/types';

export type PlanConfig = { collections: Record<string, string> };

export interface PlanMetadata extends Metadata<'plan', PlanConfig> {}

export type Plan = any;

export class PlanResource<TPlan extends Plan> extends Resource<
  PlanMetadata,
  TPlan
> {}
