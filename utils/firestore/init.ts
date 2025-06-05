// this file is only for node environment

import { Env } from '../env';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getLocalCert } from '../getLocalCert';

const initFirestoreWithLocalCert = (localCertPath: string) => {
  const localCert = getLocalCert(localCertPath);
  console.log(`init cloudstore with local cert from ${localCertPath}`);

  return initializeApp({
    credential: cert(localCert),
  });
};

const initFirestoreWithGcpVM = () => {
  console.log(`init cloudstore with GCP cloud default`);

  return initializeApp({
    credential: applicationDefault(),
  });
};

// init the firestore with correspond way by environment variable
export const initByEnv = (env: Env) => {
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
