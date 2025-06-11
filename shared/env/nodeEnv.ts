import dotenv from 'dotenv';
import { assertNodeRuntime } from '../runtime';

const ENV_PATH = ['.env.local', '.env'];

const injectNodeEnv = (path: string[] = ENV_PATH) => {
  assertNodeRuntime();

  dotenv.config({ path });

  if (typeof process === 'undefined' || !process.env) {
    throw new Error('Not node environment');
  }

  return process.env;
};

export { injectNodeEnv };
