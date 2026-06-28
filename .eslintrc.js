module.exports = {
  extends: ['next/eslint-recommended', 'next/core-web-vitals-16'],
  rules: {
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-no-target-blank': 'off',
  },
  ignorePatterns: ['node_modules/', '.next/', 'out/', '*.cjs', '*.mjs'],
};
