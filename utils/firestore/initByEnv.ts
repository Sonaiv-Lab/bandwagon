import { Env } from '../createEnv';
import { initFirestoreWithGcpVM, initFirestoreWithLocalCert } from './init';

// init the firestore with correspond way by environment variable
const initByEnv = (env: Env) => {
  const deployEnv = env.DEPLOY_ENV;

  const initFuncs = {
    local: () => {
      if (!env.FIRESTORE_CERT_LOCAL) {
        throw new Error(
          'not local env or missing FIRESTORE_CERT_LOCAL env var'
        );
      }
      return initFirestoreWithLocalCert(env.FIRESTORE_CERT_LOCAL);
    },
    gcp: initFirestoreWithGcpVM,
  };

  const initFunc = initFuncs[deployEnv];

  if (!initFunc) {
    throw new Error('firestore init error: env not support');
  }

  return initFunc();
};

export default initByEnv;
