module.exports = {
  extends: ['plugin:@next/next/recommended'],
  rules: {
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-no-target-blank': 'off',
  },
  ignorePatterns: ['node_modules/', '.next/', 'out/', '*.cjs', '*.mjs'],
  settings: {
    react: {
      version: 'detect',
    },
  },
};