import createEnv from '@bandwagon/utils/createEnv';
import { injectNodeEnv } from './nodeEnv';

const env = (() => {
  const env = injectNodeEnv();

  return createEnv(env);
})();

export default env;
