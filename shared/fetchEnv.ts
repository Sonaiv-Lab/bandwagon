import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { GoogleAuth } from 'google-auth-library';

import { z, ZodError } from 'zod';
import { readFileSync, writeFileSync } from 'node:fs';

// This should be set in secret manger
export const envSchema = z.enum(['prod', 'dev'], {
  message: 'env only prod | dev, set NODE_ENV for these value',
});
export const targetPathSchema = z.string({ message: 'invalid path' });
export const certPathSchema = z.string({ message: 'invalid cert path' });
  ;
const credentialSchema = z.object({
  private_key: z.string(),
  client_email: z.string(),
  project_id: z.string(),
});

export type Cert = z.infer<typeof certPathSchema>;
export type Target = z.infer<typeof targetPathSchema>;

function checkProjectId(id: any): asserts id is string {
  z.string().parse(id);
}

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
const main = async ({
  secretName,
  target = './.env',
  cert = `../.cert/${secretName}.json`,
}: {
  secretName: string;
  target?: z.infer<typeof targetPathSchema>;
  cert?: z.infer<typeof certPathSchema>;
}) => {
  try {
    targetPathSchema.parse(target);

    let secretConfig;
    let projectId = await getProjectId();

    const isCloud = !!projectId;

    // if in local env (no GCP build-in env var). Get the credential from file
    if (!isCloud) {
      certPathSchema.parse(cert);

      console.info(`get cert from: ${cert}`);

      const credentialsFile = readFileSync(cert, 'utf8');
      const credentials = JSON.parse(credentialsFile) as z.infer<
        typeof credentialSchema
      >;

      credentialSchema.parse(credentials);

      projectId = credentials.project_id;

      secretConfig = {
        credentials,
      };
    } else {
      console.info(`get cert from cloud`);
    }

    checkProjectId(projectId)

    const secretManagerClient = new SecretManagerServiceClient(secretConfig);

    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;

    const [response] = await secretManagerClient.accessSecretVersion({
      name,
    });

    if (!response?.payload?.data) {
      throw new Error('no response');
    }

    const secretStr = response.payload.data.toString();

    writeFileSync(target, secretStr, {
      encoding: 'utf8',
    });

    console.log(`secret "${secretName}" is fetched from cloud and save as :${target}`);
    

    process.exit(0);
  } catch (err) {
    if (err instanceof ZodError) {
      console.error(err.message);
    }
    if (err instanceof Error) {
      console.error(err?.message);
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

export default main;
