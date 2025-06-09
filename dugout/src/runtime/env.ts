import { injectNodeEnv, createEnv } from '@bandwagon/shared/env';

const env = (() => {
  // first, inject the environment variable by NODE_ENV
  const env = injectNodeEnv();

  // next create the env from the injected environment variables
  return createEnv(env);
})();

export default env;
