// this file is only for node environment

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getLocalCert } from '../getLocalCert';

export const initFirestoreWithLocalCert = (localCertPath: string) => {
  const localCert = getLocalCert(localCertPath);
  console.log(`init cloudstore with local cert from ${localCertPath}`);

  return initializeApp({
    credential: cert(localCert),
  });
};

export const initFirestoreWithGcpVM = () => {
  console.log(`init cloudstore with GCP cloud default`);

  return initializeApp({
    credential: applicationDefault(),
  });
};


