// Auto-generated entry point for all custom scripts in packages/scripts
// Re-export each script as a named export for easy import elsewhere.
// Note: CommonJS scripts are also re-exported as ESM wrappers.

export * from './_test_context_edge.mjs';
export * from './_test_context_sanitize.mjs';
export * from './avatar-cleanup.mjs';
export * from './avatar-metrics.mjs';
export * from './avatar-metrics.reg.test.mjs';
export * from './avatar-moc-sync.mjs';
export * from './e2e-test-crawler.mjs';
export * from './encoding-check.mjs';
export * from './hermes-model.mjs';
export * from './karpathy-reasoning-core.mjs';
export * from './knowledge-avatar.mjs';
export * from './oa-entropy-engine.mjs';
export * from './oa-inter-swarm-comm.mjs';
export * from './oa-memory-60-smoke.mjs';
export * from './oa-memory-healthcheck.mjs';
export * from './oa-memory-recall.mjs';
export * from './oa-predictive-maintenance.mjs';
export * from './oa-vps-keepalive.mjs';
export * from './setup-hooks.mjs';
export * from './start-esggo-core.mjs';
export * from './sync-lang-matrix.mjs';
export * from './tdai-memory-sync.mjs';
export * from './test-vault-walk.mjs';
export * from './vault-access-guard.mjs';
export * from './vault-walk.mjs';
export * from './verify-domain-matrix.mjs';
export * from './verify-incremental.mjs';
export * from './verify-journey-matrix.mjs';
export * from './verify-terminal-origin.mjs';
export * from './video-creation-test-suite.mjs';

// CommonJS scripts – wrap using dynamic import and re-export default
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
export const gateControl = require('./gate-control.cjs');
export const gateControl2 = require('./gate-control-2.cjs');
export const genGalleryIndex = require('./gen-gallery-index.cjs');
export const predictAndPreFetch = require('./predictAndPreFetch.cjs');
