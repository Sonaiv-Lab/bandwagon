import { Metadata, Resource } from '#shared/resource';
import { AnyFunctionWithReturn } from "#shared/utils/types";

export type PlanConfig = {
  input: string;
};

export interface PlanMetadata
  extends Metadata<'plan', PlanConfig> {}

export type Plan = AnyFunctionWithReturn;

export class PlanResource<TPlan extends Plan> extends Resource<
  PlanMetadata,
  TPlan
> {}
