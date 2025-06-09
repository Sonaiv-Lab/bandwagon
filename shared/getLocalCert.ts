import { assertNodeRuntime } from './runtime';
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const getLocalCert = (localCertPath: string) => {
  assertNodeRuntime();
  const certPath = resolve(process.cwd(), localCertPath);
  console.log(`parse local cert: ${certPath}`);

  const certFile = readFileSync(certPath, 'utf-8');

  const certJSON = JSON.parse(certFile);

  return certJSON;
};
