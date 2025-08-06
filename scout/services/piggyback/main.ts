import { FetchGetgamedatas } from '#resources/fetcher/fetchers/fetchgamedatas';
import { NormalizeGameDatas } from '#resources/normalization/normalizations/gameData';
import { stdout } from 'node:process';

async function main() {
  const value = await FetchGetgamedatas.use();
  const data = NormalizeGameDatas.use(value);

  stdout.write(JSON.stringify(data));
}

main();
