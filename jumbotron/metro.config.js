const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const WORKSPACE_ROOT = path.resolve(__dirname, '..');

console.log('ROOT', WORKSPACE_ROOT);

const config = {watchFolders: [WORKSPACE_ROOT]};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

// ref: https://github.com/facebook/react-native/issues/27712#issuecomment-2538013156
/**
 */
// const {makeMetroConfig} = require('@rnx-kit/metro-config');
// const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');

// module.exports = makeMetroConfig({
//   resolver: {
//     resolveRequest: MetroSymlinksResolver(),
//   },
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: false,
//       },
//     }),
//   },
// });
