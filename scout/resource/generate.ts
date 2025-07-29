import { argv } from 'node:process';
import { execSync } from 'node:child_process';
import { parse } from '@babel/parser';
import { runInNewContext } from 'vm';
import { type File } from '@babel/types';
import crypto from 'node:crypto';
import esbuild from 'esbuild';
import fs from 'node:fs';
import generateMod from '@babel/generator';
import pathModule from 'node:path';
import traverseMod from '@babel/traverse';
import type { Node } from '@babel/traverse';
import { type Metadata } from './resource';
import { DateTime } from 'luxon';


/**
 * TODO
 * [ ] 處理上面要 default 的問題，要認真理解 cjs 跟 esm 的轉換還有 tsconfig
 * [ ] 目前都只支援 ts 檔案，然後只支援 relative 的 import，這應該短期不會是個問題拉，但看有沒有搶要調整
 */

// 這裡的 import 出來的 type 跟 TS bundle 出來的東西對不上，先 workaround 之後再處理
const { default: generate } = generateMod as unknown as {
  default: typeof generateMod;
};

const { default: traverse } = traverseMod as unknown as {
  default: typeof traverseMod;
};

function isRootDir(path: string) {
  try {
    const packageFilePath = pathModule.join(path, 'package.json');
    const text = fs.readFileSync(packageFilePath, 'utf8');
    const json = JSON.parse(text);
    if (json.name === 'bandwagon') {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

const getRootDirPath = () => {
  let current = process.cwd();
  while (true) {
    const isRootDirPath = isRootDir(pathModule.resolve(current));
    if (isRootDirPath) {
      console.log(current);

      return current;
    }
    const up = pathModule.join(current, '../');
    current = up;
  }
};

const rootDirPath = getRootDirPath();


const getEntryFromResourcePath = (resourcePath: string) => {
  const sourceFile = fs.readFileSync(resourcePath, 'utf-8');
  const resourceFileDir = pathModule.dirname(resourcePath);

  const ast = parse(sourceFile, {
    sourceType: 'module',
    plugins: ['typescript'],
  });

  const parent = ast satisfies File;

  let entryImportFrom: string | undefined;

  traverse(parent as unknown as Node, {
    ImportDeclaration(path) {
      if (!path?.node?.leadingComments) return;

      const leadingComment = path.node?.leadingComments[0];
      // 如果 import expression 上面有 @resource: entry import，就代表是 resource entry

      if (leadingComment?.value.trim().match('@resource: entry')) {
        entryImportFrom = path.node.source.value;
      }
    },
  });

  if (!entryImportFrom) {
    throw new Error(
      `entryImportFrom missing!! check syntax from ${resourcePath}`
    );
  }

  // only support ts entry file and relative import path... <== it's suck
  const relative = pathModule.join(resourceFileDir, `${entryImportFrom}.ts`);

  const absEntryFilePath = pathModule.resolve(relative);

  return {
    raw: entryImportFrom,
    absolute: absEntryFilePath,
    relative,
  };
};

const getGitHash = () => {
  const res = execSync('git rev-parse HEAD').toString().trim();

  return res;
};

const getFileBundleHash = (absPath: string) => {
  const {
    outputFiles: [{ hash }],
  } = esbuild.buildSync({
    entryPoints: [absPath],
    write: false,
    minify: true,
    format: 'esm',
    platform: 'node',
  });

  return hash;
};

const getMetadataFromAbsPath = (filepath: string) => {
  const sourceFile = fs.readFileSync(filepath, 'utf-8');
  const ast = parse(sourceFile, {
    sourceType: 'module',
    plugins: ['typescript'],
  });

  const parent = ast satisfies File;

  let metadata: Metadata | undefined;

  traverse(parent as unknown as Node, {
    ExportNamedDeclaration(path) {
      if (
        path.node.declaration?.type === 'VariableDeclaration' &&
        path.node.declaration.declarations[0].id.type === 'Identifier' &&
        path.node.declaration.declarations[0].id?.name === 'metadata'
      ) {
        const metadataAst = path.node.declaration.declarations[0];

        const { code: metadataStr } = generate(metadataAst);

        metadata = runInNewContext(metadataStr);
      }
    },
  });

  return metadata;
};

function createHash(input: string) {
  const hash = crypto.createHash('sha1');
  hash.update(input);
  return 'sha1:' + hash.digest('hex').slice(0, 8);
}

const getFingerprint = ({
  bundledHash,
  metaData,
  entry
}: {
  bundledHash: string;
  metaData: Metadata
  entry: string
}) => {
  // fingerprint 用以辨別兩個版本有沒有功能上的差異，這裡會放上與功能相關的 resource 作 hash
  const functionalPart = {
    bundledHash,
    type: metaData.type,
    config: metaData.config,
    entry
  };

  const fingerprint = createHash(JSON.stringify(functionalPart));

  return fingerprint;
};

const getId = (metaData: Metadata) => {
  return `${metaData.type}::${metaData.name}@${metaData.version}`
};

const makeResource = (resourcePath: string) => {
  try {
    const absResourcePath = pathModule.resolve(resourcePath);

    const entry = getEntryFromResourcePath(resourcePath);

    const { absolute: absEntryPath } = entry;

    const metadata = getMetadataFromAbsPath(absResourcePath);

    const bundledHash  = getFileBundleHash(absEntryPath)

    if (!metadata) {
      throw new Error(`no metaData from ${resourcePath}`);
    }

    const resourcePathFromRoot = pathModule.relative(rootDirPath, absResourcePath);
    const entryPathFromRoot = pathModule.relative(rootDirPath, absEntryPath);


    const fingerPrint = getFingerprint({
      bundledHash,
      metaData: metadata,
      entry: entryPathFromRoot
    });


    const resource = {
      id: getId(metadata),
      metadata,
      gitHash: getGitHash(),
      bundledHash,
      fingerPrint,
      resourcePath: resourcePathFromRoot,
      entryPath: entryPathFromRoot,
      buildAt: DateTime.now().toISO(),
    };

    console.log('resource', resource);

    return resource;
  } catch (err) {
    console.log(err);
    console.trace();
    throw err;
  }
};

(function main() {
  const resourceFilePath = argv[2];
  const resource = makeResource(resourceFilePath);

  const absResourceFileDir = pathModule.dirname(
    pathModule.resolve(resourceFilePath)
  );

  // only support ts file...
  const resourceFileBasename = pathModule.basename(resourceFilePath, '.ts');

  const filename = `${resourceFileBasename}.json`;

  const resourceJsonFilePath = pathModule.join(absResourceFileDir, filename);

  console.log('resourceJsonPath', resourceJsonFilePath);

  fs.writeFileSync(
    resourceJsonFilePath,
    JSON.stringify(resource, undefined, 2)
  );
})();
