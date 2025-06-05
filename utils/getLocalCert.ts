import { assertNodeRuntime } from './runtime';

export const getLocalCert = async (localCertPath: string) => {
  assertNodeRuntime();

  const { readFileSync } = await import('node:fs');
  const { resolve } = await import('node:path');

  const certPath = resolve(process.cwd(), localCertPath);
  console.log(`parse local cert: ${certPath}`);

  const certFile = readFileSync(certPath, 'utf-8');

  const certJSON = JSON.parse(certFile);

  return certJSON;
};
