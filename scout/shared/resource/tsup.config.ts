import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'scout:node',
  noExternal: ['@bandwagon'],
  target: 'node20',
  format: 'esm',
  platform: 'node',
  outDir: 'resource/temp/',
  minify: true,
  
});