import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import env from '#/utils/env';
import type { Env } from '@bandwagon/utils/createEnv';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { LoggingWinston } from '@google-cloud/logging-winston';
import type { Options } from '@google-cloud/logging-winston';

const getInitLocalCertInfo = () => {
  if (!env.FIRESTORE_CERT_LOCAL) {
    throw new Error('not local env or missing FIRESTORE_CERT_LOCAL env var')
  }
  const certPath = resolve(process.cwd(), env.FIRESTORE_CERT_LOCAL);
  console.log(`init cloudstore with local cert`);
  console.log(`use cert from: ${certPath}`);

  const certFile = readFileSync(certPath, 'utf-8');

  const certJSON = JSON.parse(certFile);

  return certJSON
}

const createLoggingWinston = () => {
  const deployEnv = env.DEPLOY_ENV;

  

  const config: Options = {
    serviceContext: {
      service: 'bandwagon/piggyback',
      // TODO, get version from package.json in build time
      version: '0.0.1',
    },
    prefix: 'bandwagon/piggyback/dev'
  };

  if (deployEnv === 'local') {
    const cert = getInitLocalCertInfo()
    config.credentials = cert;
    config.projectId = cert.projectId
  }

  const loggingWinston = new LoggingWinston(config);

  return loggingWinston;
};

export { createLoggingWinston };
