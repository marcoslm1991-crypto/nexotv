const path = require('path');

const monorepoRoot = path.resolve(__dirname, '../../');

module.exports = {
  watchFolders: [monorepoRoot],
  serializer: {
    getPolyfills: () => require('react-native/rn-get-polyfills')(),
  },
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
  },
  transformer: {
    assetRegistryPath: '@react-native/assets-registry/registry',
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
