import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { GoogleAuth } from 'google-auth-library';

import { z, ZodError } from 'zod';
import { readFileSync, writeFileSync } from 'node:fs';
import { argv } from 'node:process';

import logger from '#/utils/logger';

// This should be set in secret manger
const SECRET_NAME = {
  prod: 'bandwagon-piggyback',
  dev: 'bandwagon-piggyback-dev',
};

const envSchema = z.enum(['prod', 'dev'], {
  message: 'env only pord | dev, set NODE_ENV for these value',
});
const pathSchema = z.string({ message: 'invalid path' });
const certPathSchema = z.string({ message: 'invalid cert path' }).nullable();
const credentialSchema = z.object({
  private_key: z.string(),
  client_email: z.string(),
  project_id: z.string(),
});

const getProjectId = async () => {
  try {
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });
    const projectId = await auth.getProjectId();
    return projectId;
  } catch {
    return undefined;
  }
};

// TODO if some days feeling boring, check this https://www.npmjs.com/package/@clack/prompts
const main = async (
  targetPath: z.infer<typeof pathSchema> = './.env',
  inputCertPath: z.infer<typeof certPathSchema>
) => {
  try {
    const env = process.env.NODE_ENV as z.infer<typeof envSchema>;
    envSchema.parse(env);
    pathSchema.parse(targetPath);

    let projectId = await getProjectId();
    let secretConfig;

    const isCloud = !!projectId;

    // if in local env (no GCP build-in env var). Get the credential from file
    if (!isCloud) {
      const certPath = inputCertPath ?? `../.cert/${SECRET_NAME[env]}.json`;
      certPathSchema.parse(certPath);

      logger.info(`get cert from: ${certPath}`);

      const credentialsFile = readFileSync(certPath, 'utf8');
      const credentials = JSON.parse(credentialsFile) as z.infer<
        typeof credentialSchema
      >;

      credentialSchema.parse(credentials);

      projectId = credentials.project_id;

      secretConfig = {
        credentials,
      };
    }

    const secretManagerClient = new SecretManagerServiceClient(secretConfig);

    const name = `projects/${projectId}/secrets/${SECRET_NAME[env]}/versions/latest`;

    const [response] = await secretManagerClient.accessSecretVersion({
      name,
    });

    if (!response?.payload?.data) {
      throw new Error('no response');
    }

    const secretStr = response.payload.data.toString();

    writeFileSync(targetPath, secretStr, {
      encoding: 'utf8',
    });

    process.exit(0);
  } catch (err) {
    if (err instanceof ZodError) {
      logger.error(err.message);
    }
    if (err instanceof Error) {
      logger.error(err?.message);
    }

    process.exit(1);
  }
};

/**
NODE_ENV=dev node ./fetchEnv.ts ./.env ../.cert/[secret].json
                                (target)    (cert path) 
- must have NODE_ENV
- target is optional, default ./.env
- cert path is option, default is .cert  dir in root path ../.cert/bandwagon-piggyback-dev.json or ../.cert/bandwagon-piggyback.json 


local: 
NODE_ENV=dev node ./fetchEnv.ts ./.env ../.cert/[get-secret-dev].json
NODE_ENV=prod node ./fetchEnv.ts ./.env
NODE_ENV=prod node ./fetchEnv.ts
NODE_ENV=dev node ./fetchEnv.ts  

cloud
GOOGLE_CLOUD_PROJECT=XXXXXXXXX node ./fetchEnv.ts ./.env
*/
main(...(argv.slice(2) as Parameters<typeof main>));
