const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
// Monorepo root is two levels up: apps/mobile -> apps -> esggo
const monorepoRoot = path.resolve(projectRoot, '..', '..');

const config = getDefaultConfig(projectRoot);

// Watch the whole monorepo so edits to packages/shared & packages/ui are picked up.
config.watchFolders = [monorepoRoot];

// Resolve node_modules from both the app and the monorepo root (pnpm symlinks).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
