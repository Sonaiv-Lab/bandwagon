import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

export const createOtlpSdk = ({
  name,
  baseurl = 'http://127.0.0.1',
}: {
  name: string;
  baseurl?: string;
}) => {
  const sdk = new NodeSDK({
    serviceName: name,
    traceExporter: new OTLPTraceExporter({
      url: `${baseurl}:4318/v1/traces`,
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: `${baseurl}:4318/v1/metrics`,
      }),
    }),
  });

  return sdk;
};


export type { NodeSDK as OtlpNodeSdk };