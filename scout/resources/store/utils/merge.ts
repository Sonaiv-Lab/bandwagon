import logger from '#shared/external/logger';
import { LeveledLogMethod } from 'winston';

/**
 * 有些值不應該變，但是他變了。先讓他變，但是有個 noti
 */

type Policy = 'BLOCK' | 'ALLOW' | 'ALLOW_FLAG';

type Severity = 'NONE' | 'INFO' | 'WARN' | 'ERROR';

const loggers: Record<Exclude<Severity, 'NONE'>, LeveledLogMethod> = {
  INFO: logger.info,
  WARN: logger.warn,
  ERROR: logger.error,
};

export const merge = <T>(
  base: T,
  income: T,
  policy: Policy | ((a: T, b: T) => T),
  severity: Severity = 'NONE',
  props?: {
    path?: string;
    reason?: string;
  }
) => {
  const { path, reason } = props ?? {};

  const logger = severity === 'NONE' ? undefined : loggers[severity];

  const next = (() => {
    if (typeof policy === 'function') {
      // 好像要調整，return 原值是不是不應該去理他
      return policy(base, income);
    }
    if (policy === 'BLOCK') {
      return base;
    } else {
      return income;
    }
  })();

  if (logger && base !== next) {
    logger({
      path,
      base,
      income,
      policy,
      reason,
    });
  }

  return next;
};

const blockChange = <T>(base: T, incoming: T) => {
  if (String(base) !== String(incoming)) {
    // TODO should log the issue
  }
  return incoming;
};
