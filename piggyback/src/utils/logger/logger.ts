import winston from 'winston';
import { format } from 'winston';
import { LoggingWinston } from "@google-cloud/logging-winston";
import { createLoggingWinston } from "./GCPlogger";

const { combine, timestamp, prettyPrint, printf } = format;

const loggingWinston = createLoggingWinston()

const myFormat = printf(({ level, message, label, timestamp }) => {
  const text = label ? `[${level}:${label}]` : `[${level}]`;
  
  return `${timestamp} ${text.padEnd(1)}:${message}`;
});

const textFormat = combine(timestamp(), prettyPrint(), myFormat)

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ format: textFormat }),
    new winston.transports.File({
      filename: '.log/logs',
      format: textFormat,
    }),
    loggingWinston,
  ],
});

const  LOGGING_TRACE_KEY =LoggingWinston.LOGGING_TRACE_KEY
const  LOGGING_SPAN_KEY =LoggingWinston.LOGGING_SPAN_KEY
const  LOGGING_SAMPLED_KEY =LoggingWinston.LOGGING_SAMPLED_KEY

export { LOGGING_TRACE_KEY, LOGGING_SPAN_KEY, LOGGING_SAMPLED_KEY };


export default logger;
