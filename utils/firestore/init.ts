// this file is only for node environment

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { assertNodeRuntime } from '../runtime';

export const initFirestoreWithLocalCert = async (localCertPath: string) => {
  assertNodeRuntime();

  const { readFileSync } = await import('node:fs');
  const { resolve } = await import('node:path');

  const certPath = resolve(process.cwd(), localCertPath);
  console.log(`init cloudstore with local cert from ${certPath}`);

  const certFile = readFileSync(certPath, 'utf-8');

  const certJSON = JSON.parse(certFile);

  return initializeApp({
    credential: cert(certJSON),
  });
};

export const initFirestoreWithGcpVM = () => {
  console.log(`init cloudstore with GCP cloud default`);
  return initializeApp({
    credential: applicationDefault(),
  });
};


