// lib/core-types.ts
// ESG Go v8.5.1 - Core Data Interfaces
// 原則參考CONFIG小心
export const T5_CORE_CONFIG = {
    requiredComponents: ['T5ProtocolCore', 'EvidenceRegistry', 'HealingServer'],
    validationRules: {
        core: ['uuid', 'hash_lock', 'status'],
        evidence: ['timestamp', 'hash_lock', 'originCause']
    }
};
//# sourceMappingURL=core-types.js.map