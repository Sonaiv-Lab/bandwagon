import { Metadata, Resource } from '#shared/resource';

export type NormalizationConfig = {
  from: string;
  to: string;
};

export interface NormalizationMetadata
  extends Metadata<'normalization', NormalizationConfig> {}

export type Normalization = (input: string) => any;


export class NormalizationResource<T extends Normalization> extends Resource<
  NormalizationMetadata,
  T
> {}

