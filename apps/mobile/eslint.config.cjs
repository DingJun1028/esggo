const { FlatCompat } = require('@eslint/eslintrc');
const path = require('path');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: path.resolve(__dirname, '..', '..'),
});

module.exports = [
  ...compat.extends('expo'),
  {
    ignores: ['dist/', '.expo/', 'web-build/', 'node_modules/'],
  },
  {
    // Node globals for this config file (CommonJS).
    files: ['eslint.config.cjs', '**/*.cjs'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'writable',
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
  {
    rules: {
      'react-native/no-raw-text': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // Scaffold fetches from the Gateway in effects; synchronous setState there is intentional.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];
