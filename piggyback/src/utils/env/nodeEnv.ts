import dotenv from 'dotenv';

const injectNodeEnv = () => {
  dotenv.config({ path: ['.env.local', '.env'] });

  if (typeof process === 'undefined' || !process.env) {
    throw new Error('Not node environment');
  }

  return process.env;
};

export { injectNodeEnv };
