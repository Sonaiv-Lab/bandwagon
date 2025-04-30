import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { z, ZodError } from 'zod';
import { readFileSync, writeFileSync } from 'node:fs';
import { argv } from "node:process";


const SECRET_NAME = {
  prod: 'bandwagon-piggyback',
  dev: 'bandwagon-piggyback-dev',
};

const envSchema = z.enum(['prod', 'dev'], {message: 'env only pord | dev'});
const pathSchema = z.string({message: 'invalid path'});
const certPathSchema = z.string({message: 'invalid cert path'});
const credentialSchema = z.object({
  private_key: z.string(),
  client_email: z.string(),
  project_id: z.string(),
});

// TODO:要馬給 ID，要馬給 json file

// TODO if some days feeling boring, check this https://www.npmjs.com/package/@clack/prompts
const main = async (
  env: z.infer<typeof envSchema>,
  targetPath: z.infer<typeof pathSchema>,
  certPath: z.infer<typeof certPathSchema>,
  ...rest: any[]
) => {
  try {
    envSchema.parse(env);
    pathSchema.parse(certPath);
    certPathSchema.parse(targetPath);

    console.log(`get cert from: ${certPath}`);

    const credentialsFIle = readFileSync(certPath, 'utf8');
    const credentials = JSON.parse(credentialsFIle);

    credentialSchema.parse(credentials);

    console.log(credentials);

    const secretManagerClient = new SecretManagerServiceClient({
      credentials,
    });

    const name = `projects/${credentials.project_id}/secrets/${SECRET_NAME[env]}/versions/latest`;

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

    console.log(secretStr);

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

main(...(argv.slice(2) as Parameters<typeof main>));
