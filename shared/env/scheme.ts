// import node type for NodeJS.ProcessEnv
/// <reference types="node" />

import { z } from 'zod';

const getEnvStringScheme = (name: string) =>
  z.string({
    message: `env prop not defined: ${name}`,
  });

const getEnvNumberScheme = (name: string) => {
  return z
    .string({ message: `env prop not defined: ${name}` })
    .regex(/^\d+$/, {
      message: `env prop is not valid number: ${name}`,
    })
    .transform((input) => {
      return Number(input);
    });
};

/**
  TODO: 參考這個部分  https://github.com/colinhacks/zod/issues/2807#issuecomment-1977406654
  在使用 zod 時以 type 為優先，再 implement zod scheme
*/
// register the environment variable right here
export const EnvSchemes = z.object({
  PIGGYBACK_BASE_URL: getEnvStringScheme('PIGGYBACK_BASE_URL'),
  LINEUP_BASE_URL: getEnvStringScheme('LINEUP_BASE_URL'),
  FIRESTORE_CERT_LOCAL: getEnvStringScheme('FIRESTORE_CERT_LOCAL').optional(),
  FIRESTORE_ID: getEnvStringScheme('FIRESTORE_ID'),
  DEPLOY_ENV: z.enum(['local', 'gcp'], {
    message: `env prop not defined: ${'DEPLOY_ENV'}`,
  }),
  // NODE_ENV is the initialize environment variable that manual set by scripts or VM config. not in .env file
  NODE_ENV: z.enum(['dev', 'prod'], {
    message: `env prop not defined: ${'NODE_ENV'}`,
  }),
  REDIS_HOST: getEnvStringScheme('REDIS_HOST'),
  DUGOUT_PORT: getEnvNumberScheme('DUGOUT_PORT').optional(),
  LINEUP_PORT: getEnvNumberScheme('LINEUP_PORT').optional(),
});

export type Env = z.infer<typeof EnvSchemes>;

export type EnvKeys = keyof Env;

export const isEnvProps = (prop: any): prop is EnvKeys => {
  return typeof prop === 'string' && prop in EnvSchemes.shape;
};
