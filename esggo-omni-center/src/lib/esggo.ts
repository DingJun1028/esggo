// Unified entry point for OmniCore public API surface.
// Re-exports the core omni-function primitives used across the app router
// (omni-center console, sustain-write pages, etc.) so consumers can import
// from a single stable path: `@/lib/esggo`.

export { omni, omniFn, createFiveTComponent } from './omni-core/omni-function';
export type { OmniKind, OmniResult, OmniRequest } from './omni-core/omni-function';
export type { CaseType, ComponentEvidence } from './omni-core/types';
