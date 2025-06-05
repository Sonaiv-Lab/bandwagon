// import node type for NodeJS.ProcessEnv
/// <reference types="node" />

import { ZodError } from 'zod';
import { isEnvProps, EnvSchemes, type Env } from './scheme';

type InputEnv = NodeJS.ProcessEnv;

const createEnv = (env: InputEnv) => {
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

export { createEnv };
