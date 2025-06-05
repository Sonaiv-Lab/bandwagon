import { Env } from '../createEnv';
import { initFirestoreWithGcpVM, initFirestoreWithLocalCert } from './init';

let FirebaseApp;

// init the firestore with correspond way by environment variable
const initByEnv = async (env: Env) => {
  if (!!FirebaseApp) return;

  const deployEnv = env.DEPLOY_ENV;

  const initFuncs = {
    local: async () => {
      if (!env.FIRESTORE_CERT_LOCAL) {
        throw new Error(
          'not local env or missing FIRESTORE_CERT_LOCAL env var'
        );
      }
      return await initFirestoreWithLocalCert(env.FIRESTORE_CERT_LOCAL);
    },
    gcp: initFirestoreWithGcpVM,
  };

  const initFunc = initFuncs[deployEnv];

  if (!initFunc) {
    throw new Error('firestore init error: env not support');
  }

  return await initFunc();
};

export default initByEnv;
