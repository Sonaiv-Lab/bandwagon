import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import type { Options } from '@google-cloud/logging-winston';
import env from '#/runtime/env';
import {
  createConsoleTransport,
  createFileTransPort,
  createGCPTransport,
} from '@bandwagon/utils/logger';

const gcpLoggingConfig: Options = {
  serviceContext: {
    service: 'bandwagon/piggyback',
    // TODO, get version from package.json in build time
    version: '0.0.1',
  },
  prefix: 'bandwagon/piggyback/dev',
};

const logger = winston.createLogger({
  transports: [
    createConsoleTransport(),
    createFileTransPort('.log/logs'),
    createGCPTransport(env, gcpLoggingConfig),
  ],
});

const LOGGING_TRACE_KEY = LoggingWinston.LOGGING_TRACE_KEY;
const LOGGING_SPAN_KEY = LoggingWinston.LOGGING_SPAN_KEY;
const LOGGING_SAMPLED_KEY = LoggingWinston.LOGGING_SAMPLED_KEY;

export { LOGGING_TRACE_KEY, LOGGING_SPAN_KEY, LOGGING_SAMPLED_KEY };

export default logger;
