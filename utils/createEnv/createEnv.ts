// import node type for NodeJS.ProcessEnv
/// <reference types="node" />

import { z, ZodError } from 'zod';

const getEnvStringScheme = (name: string) =>
  z.string({
    message: `env prop not defined: ${name}`,
  });

// register the environment variable right here
const EnvSchemes = z.object({
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

type Env = z.infer<typeof EnvSchemes>;

type EnvKeys = keyof Env;

const isEnvProps = (prop: any): prop is EnvKeys => {
  return typeof prop === 'string' && prop in EnvSchemes.shape;
};

type InputEnv = NodeJS.ProcessEnv;

const getEnv = (env: InputEnv) => {
  return new Proxy({} as Env, {
    get(_target, prop, _receiver) {
      try {
        // make every env been checked
        if (!isEnvProps(prop)) {
          throw new Error('invalid env prop');
        }
        const scheme = EnvSchemes.shape[prop];

        const value = env?.[prop];
        scheme.parse(value);

        return value;
      } catch (err) {
        if (err instanceof ZodError) {
          throw new Error(err.message);
        }
        throw err;
      }
    },
  });
};

export type { Env };

export default getEnv;
