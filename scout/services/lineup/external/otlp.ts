import { PROJECT_NAME } from '../runtime/config';
import { OtlpNodeSdk, createOtlpSdk } from '#shared/external/otlp';

let otlpSdk: OtlpNodeSdk;

export const initOtlp = async () => {
  if (!otlpSdk) {
    otlpSdk = await createOtlpSdk({ name: PROJECT_NAME });
  }

  otlpSdk.start();

  return otlpSdk;
};
