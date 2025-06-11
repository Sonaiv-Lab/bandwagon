import { defineConfig } from 'tsup'

/**
 * todo:
 * - [ ] source map in dev mode
 * - [ ] use different config by options (in future, it may run on could function)
*/
export default defineConfig({
  name: 'dugout:node',
  // its so important to not treat fp-ts as noExternal, it would put fp-ts in to builded file instead as dependencies to package import parse error in node env. make it align with tsx in dev mode
  noExternal: ['@bandwagon', 'fp-ts'],
  target: 'node20',
  format: 'esm',
  platform: 'node',
  sourcemap: 'inline',
});