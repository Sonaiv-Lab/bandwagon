import { z } from 'zod';
import { argv } from 'node:process';

import fetchEnv, { envSchema } from '@bandwagon/shared/fetchEnv';
import type { Cert, Target } from '@bandwagon/shared/fetchEnv';

// This should be set in secret manger
const SECRET_NAME = {
  prod: 'bandwagon-piggyback',
  dev: 'bandwagon-piggyback-dev',
} as const;

const main = async (target: Target, cert: Cert) => {
  const env = process.env.NODE_ENV as z.infer<typeof envSchema>;
  envSchema.parse(env);

  const secretName = SECRET_NAME[env];

  fetchEnv({
    secretName,
    target,
    cert,
  });
};

main(...(argv.slice(2) as [Target, Cert]));
