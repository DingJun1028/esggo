// Omni System Exports

// OMC-4: Omni Knowledge Vault
export { OmniKnowledge } from './infrastructure/knowledge/OmniKnowledge.ts';
export { useOmniMemory } from './infrastructure/memory/OmniMemory.ts';

// OMC-11: Omni Tag System
export type {
  OmniEntity,
  ESGDataTag,
  OmniResonance,
  OmniResponse,
} from './infrastructure/types/Omni-entity.types.ts';

export type {
  IOmniComponentCore,
  UUID,
  IntegrityStatus,
  ValidatedData,
  EvidenceMap,
} from './infrastructure/types/Omni-component-core.types.ts';

// Hooks
export { useOmniResonance } from './hooks/useOmniResonance.ts';

// Constants
export {
  MANIFESTO,
  calculateEntropyReduction,
} from './infrastructure/types/Omni-component-core.types.ts';
