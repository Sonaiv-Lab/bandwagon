import { defineConfig } from 'tsup'

/**
 * todo:
 * - [ ] source map in dev mode
 * - [ ] use different config by options (in future, it may run on could function)
*/
export default defineConfig({
  name: 'scout:node',
  noExternal: ['@bandwagon', 'fp-ts'],
  target: 'node20',
  format: 'esm',
  platform: 'node',
  sourcemap: 'inline',
});