export type ValueOf<TRecord extends Record<string | number, unknown>> =
  TRecord[keyof TRecord];
