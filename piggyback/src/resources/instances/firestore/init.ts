import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import env from '#/utils/env';
import type { Env } from '@bandwagon/utils/createEnv';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const initLocal = () => {
  if (!env.FIRESTORE_CERT_LOCAL) {
    throw new Error('not local env or missing FIRESTORE_CERT_LOCAL env var')
  }
  const certPath = resolve(process.cwd(), env.FIRESTORE_CERT_LOCAL);
  console.log(`init cloudstore with local cert`);
  console.log(`use cert from: ${certPath}`);

  const certFile = readFileSync(certPath, 'utf-8');

  const certJSON = JSON.parse(certFile);

  initializeApp({
    credential: cert(certJSON),
  });
};

const initGCP = () => {
  console.log(`init cloudstore with GCP cloud default`);
  initializeApp({
    credential: applicationDefault(),
  });
};

// add the other method if need serve on cloud function

// init the firestore with correspond way by environment variable
const init = () => {
  const deployEnv = env.DEPLOY_ENV;

  const initFuncs: Partial<Record<Env['DEPLOY_ENV'], () => void>> = {
    local: initLocal,
    gcp: initGCP,
  };

  const initFunc = initFuncs[deployEnv];

  if (!initFunc) {
    throw new Error('firestore init error: env not support');
  }

  return initFunc();
};

export default init;
