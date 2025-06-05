// import node type for NodeJS.ProcessEnv
/// <reference types="node" />

import { z } from 'zod';

const getEnvStringScheme = (name: string) =>
  z.string({
    message: `env prop not defined: ${name}`,
  });

// register the environment variable right here
export const EnvSchemes = z.object({
  FIRESTORE_CERT_LOCAL: getEnvStringScheme('FIRESTORE_CERT_LOCAL').optional(),
  FIRESTORE_ID: getEnvStringScheme('FIRESTORE_ID'),
  DEPLOY_ENV: z.enum(['local', 'gcp'], {
    message: `env prop not defined: ${'DEPLOY_ENV'}`,
  }),
  RUNTIME_ENVIRONMENT: z.enum(['node', 'cloud'], {
    message: `env prop not defined: ${'RUNTIME_ENVIRONMENT'}`,
  }),
  NODE_ENV: z.enum(['dev', 'prod']),
});

export type Env = z.infer<typeof EnvSchemes>;

export type EnvKeys = keyof Env;

export const isEnvProps = (prop: any): prop is EnvKeys => {
  return typeof prop === 'string' && prop in EnvSchemes.shape;
};
