import winston from 'winston';
import { format } from 'winston';

const { combine, timestamp, prettyPrint, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  const text = label ? `[${level}:${label}]` : `[${level}]`;
  
  return `${timestamp} ${text.padEnd(1)}:${message}`;
});

const logger = winston.createLogger({
  format: combine(timestamp(), prettyPrint(), myFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: '.log/error.log', level: 'error' }),
    new winston.transports.File({ filename: '.log/all.log' }),
  ],
});

export default logger;
