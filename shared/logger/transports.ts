import winston, { format } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import type { Options } from '@google-cloud/logging-winston';
import { getLocalCert } from '../getLocalCert';
import { type Env } from '../env';

const { combine, timestamp, prettyPrint, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  const text = label ? `[${level}:${label}]` : `[${level}]`;

  return `${timestamp} ${text.padEnd(1)}:${message}`;
});

const textFormat = combine(timestamp(), prettyPrint(), myFormat);

const createConsoleTransport = () =>
  new winston.transports.Console({ format: textFormat });

const createFileTransPort = (filename: string = '.log/logs') => {
  return new winston.transports.File({
    filename,
    format: textFormat,
  });
};

const createGCPTransport = ({
  gcpLoggingConfig,
  certPath,
  deployEnv
}: {
  gcpLoggingConfig: Options;
  certPath: Env['FIRESTORE_CERT_LOCAL'];
  deployEnv: Env['DEPLOY_ENV'];
}) => {
  if (deployEnv === 'local') {
    if (!certPath) {
      throw new Error('not local env or missing FIRESTORE_CERT_LOCAL env var');
    }

    const cert = getLocalCert(certPath);

    gcpLoggingConfig.credentials = cert;
    gcpLoggingConfig.projectId = cert.project_id;
  }

  const loggingWinston = new LoggingWinston(gcpLoggingConfig);

  return loggingWinston;
};

export { createFileTransPort, createConsoleTransport, createGCPTransport };
