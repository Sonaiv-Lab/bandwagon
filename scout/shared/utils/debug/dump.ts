import path from 'node:path';
import fs from 'node:fs';
import packageJson from "#scout/package.json";

function isRootDir(target: string, project: string = packageJson.name) {
  try {
    const packageFilePath = path.join(target, 'package.json');
    const text = fs.readFileSync(packageFilePath, 'utf8');
    const json = JSON.parse(text);
    if (json.name === project) {
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
    const isRootDirPath = isRootDir(path.resolve(current));
    if (isRootDirPath) {
      return current;
    }
    const up = path.join(current, '../');
    current = up;
  }
};

export const dumpDebug = (text: string, filename: string, dist: string = '.log') => {
  const rootDir = getRootDirPath();

  const targetDir = path.join(rootDir, dist);

  // fs.mkdirSync(targetDir, { recursive: true });
  const target = path.join(rootDir, dist, filename);

  fs.writeFileSync(target, text, { encoding: 'utf8' });
};
