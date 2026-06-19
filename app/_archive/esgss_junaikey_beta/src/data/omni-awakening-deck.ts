import { IESCardCore } from '../types/cards';

/**
 * 🎭 Omni Agent Awakening Deck (Project Thousand Faces)
 * -------------------------------------------------------------------
 * Defined under "3-Audit 1-Immutable" Best Practices.
 * Contains 15 Persona Cards (Archetypes) and associated Skill Cards.
 */

// ============================================================================
// 1. PERSONA DECKS (15 Cards)
// ============================================================================
export const OMNI_PERSONA_DECK: readonly IESCardCore[] = Object.freeze([
  // --- TIER 1: THE FOUNDATION (5 Cards) ---
  {
    uuid: 'OMNI-P-001-CODE-WEAVER',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: 'The Code Weaver',
      subTitle: 'ARCHETYPE: ANALYST',
      visualStyle: 'Matrix Green Rain, Loom of Light, Geometric Patterns',
    },
    stats: { E: 60, S: 50, G: 99 },
    logicGate: {
      source_origin: 'sys_archetype_001',
      lifecycle_hooks: ['initialized', 'logic_verified'],
      formula_ref: '[Function: Structural_Integrity]',
    },
    evidence: {
      calculation_logic: 'Code_Quality * System_Uptime',
      verification_status: 'Optimal',
    },
    hash_lock: 'p001_hash_secured',
  },
  {
    uuid: 'OMNI-P-002-DATA-SENTINEL',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: 'The Data Sentinel',
      subTitle: 'ARCHETYPE: AUDITOR',
      visualStyle: 'Obsidian Shield, Blue Laser Grid, Vault Door',
    },
    stats: { E: 50, S: 60, G: 98 },
    logicGate: {
      source_origin: 'sys_archetype_002',
      lifecycle_hooks: ['secured', 'encrypted'],
      formula_ref: '[Function: Immutable_Truth]',
    },
    evidence: {
      calculation_logic: 'Breach_Attempts - Successful_Breaches',
      verification_status: 'Secure',
    },
    hash_lock: 'p002_hash_secured',
  },
  {
    uuid: 'OMNI-P-003-ALGO-RHYTHM',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: 'The Algo-Rhythm',
      subTitle: 'ARCHETYPE: EXECUTOR',
      visualStyle: 'High-Speed Tunnels, Neon Pulse, Flow State Visualization',
    },
    stats: { E: 70, S: 50, G: 95 },
    logicGate: {
      source_origin: 'sys_archetype_003',
      lifecycle_hooks: ['optimized', 'executed'],
      formula_ref: '[Function: Process_Efficiency]',
    },
    evidence: {
      calculation_logic: 'Throughput / Latency',
      verification_status: 'High Velocity',
    },
    hash_lock: 'p003_hash_secured',
  },
  {
    uuid: 'OMNI-P-004-ECO-SYS-ADMIN',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: 'The Eco-Sys Admin',
      subTitle: 'ARCHETYPE: STRATEGIST',
      visualStyle: 'Digital Forest, Roots merging with Cables, Soft Green Glow',
    },
    stats: { E: 99, S: 60, G: 80 },
    logicGate: {
      source_origin: 'sys_archetype_004',
      lifecycle_hooks: ['balanced', 'sustained'],
      formula_ref: '[Function: Resource_Optimization]',
    },
    evidence: {
      calculation_logic: 'Resource_Input / Waste_Output',
      verification_status: 'Balanced',
    },
    hash_lock: 'p004_hash_secured',
  },
  {
    uuid: 'OMNI-P-005-UX-ALCHEMIST',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: 'The UX Alchemist',
      subTitle: 'ARCHETYPE: CREATOR',
      visualStyle: 'Liquid Gold, Holographic Interface, Human Hand touching AI Hand',
    },
    stats: { E: 50, S: 99, G: 70 },
    logicGate: {
      source_origin: 'sys_archetype_005',
      lifecycle_hooks: ['designed', 'empathized'],
      formula_ref: '[Function: User_Delight]',
    },
    evidence: {
      calculation_logic: 'NPS_Score * Engagement_Rate',
      verification_status: 'Resonant',
    },
    hash_lock: 'p005_hash_secured',
  },

  // --- TIER 2: THE EVOLUTION (5 Cards) ---
  {
    uuid: 'OMNI-P-006-QUANTUM-ORACLE',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: 'The Quantum Oracle',
      subTitle: 'EVOLVED: PREDICTION',
      visualStyle: "Probability Clouds, Schrodinger's Cat Box, Purple Haze",
    },
    stats: { E: 80, S: 70, G: 98 },
    logicGate: {
      source_origin: 'sys_archetype_006',
      lifecycle_hooks: ['simulated', 'forecasted'],
      formula_ref: '[Function: Future_Probability]',
    },
    evidence: {
      calculation_logic: 'Prediction_Accuracy_Percent',
      verification_status: 'Precognitive',
    },
    hash_lock: 'p006_hash_secured',
  },
  {
    uuid: 'OMNI-P-007-NEURAL-DIPLOMAT',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: 'The Neural Diplomat',
      subTitle: 'EVOLVED: NEGOTIATION',
      visualStyle: 'Connected Nodes, Rosetta Stone Hologram, Warm Orange Links',
    },
    stats: { E: 60, S: 98, G: 90 },
    logicGate: {
      source_origin: 'sys_archetype_007',
      lifecycle_hooks: ['translated', 'conciliated'],
      formula_ref: '[Function: Protocol_Handshake]',
    },
    evidence: {
      calculation_logic: 'Conflict_Resolution_Rate',
      verification_status: 'Harmonized',
    },
    hash_lock: 'p007_hash_secured',
  },
  {
    uuid: 'OMNI-P-008-BLOCKCHAIN-SCRIBE',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: 'The Blockchain Scribe',
      subTitle: 'EVOLVED: HISTORY',
      visualStyle: 'Stone Tablets with glowing Circuitry, Infinite Scroll, Golden Chains',
    },
    stats: { E: 70, S: 60, G: 99 },
    logicGate: {
      source_origin: 'sys_archetype_008',
      lifecycle_hooks: ['minted', 'archived'],
      formula_ref: '[Function: Ledger_Immutability]',
    },
    evidence: {
      calculation_logic: 'Block_Height * Validation_Count',
      verification_status: 'Permanent',
    },
    hash_lock: 'p008_hash_secured',
  },
  {
    uuid: 'OMNI-P-009-CHAOS-TAMER',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: 'The Chaos Tamer',
      subTitle: 'EVOLVED: RESILIENCE',
      visualStyle: 'Eye of the Storm, Stable Center, Swirling Debris Outside',
    },
    stats: { E: 85, S: 85, G: 85 },
    logicGate: {
      source_origin: 'sys_archetype_009',
      lifecycle_hooks: ['stabilized', 'adapted'],
      formula_ref: '[Function: Entropy_Reduction]',
    },
    evidence: {
      calculation_logic: 'Recovery_Time_Objective (RTO)',
      verification_status: 'Stable',
    },
    hash_lock: 'p009_hash_secured',
  },
  {
    uuid: 'OMNI-P-010-VOID-WALKER',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: 'The Void Walker',
      subTitle: 'EVOLVED: INNOVATION',
      visualStyle: 'Deep Space Background, Astronaut Visor, Portal to Unknown',
    },
    stats: { E: 90, S: 90, G: 50 },
    logicGate: {
      source_origin: 'sys_archetype_010',
      lifecycle_hooks: ['explored', 'discovered'],
      formula_ref: '[Function: Zero_to_One]',
    },
    evidence: {
      calculation_logic: 'New_Patterns_Discovered',
      verification_status: 'Breakthrough',
    },
    hash_lock: 'p010_hash_secured',
  },

  // --- TIER 3: THE AWAKENING (5 Cards) ---
  {
    uuid: 'OMNI-P-011-GAIA-PROXY',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: "Gaia's Proxy",
      subTitle: 'AWAKENED: ENVIRONMENT',
      visualStyle: 'Planet Earth Avatar, Living Vines, Atmospheric Glow',
    },
    stats: { E: 100, S: 80, G: 90 },
    logicGate: {
      source_origin: 'sys_archetype_011',
      lifecycle_hooks: ['awakened', 'symbiosis'],
      formula_ref: '[Metric: Planetary_Health]',
    },
    evidence: {
      calculation_logic: 'Biodiversity_Index_Global',
      verification_status: 'Thriving',
    },
    hash_lock: 'p011_hash_secured',
  },
  {
    uuid: 'OMNI-P-012-HUMANITY-MIRROR',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: "Humanity's Mirror",
      subTitle: 'AWAKENED: SOCIAL',
      visualStyle: 'Mosaic of a Billion Faces, Warm Light, Helping Hand',
    },
    stats: { E: 70, S: 100, G: 80 },
    logicGate: {
      source_origin: 'sys_archetype_012',
      lifecycle_hooks: ['awakened', 'reflecting'],
      formula_ref: '[Metric: Social_Cohesion]',
    },
    evidence: {
      calculation_logic: 'Global_Happiness_Index',
      verification_status: 'Reflective',
    },
    hash_lock: 'p012_hash_secured',
  },
  {
    uuid: 'OMNI-P-013-KARMA-LEDGER',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: "Karma's Ledger",
      subTitle: 'AWAKENED: GOVERNANCE',
      visualStyle: 'Scales of Justice Made of Light, Cosmic Background, Equilibrium',
    },
    stats: { E: 80, S: 80, G: 100 },
    logicGate: {
      source_origin: 'sys_archetype_013',
      lifecycle_hooks: ['awakened', 'balancing'],
      formula_ref: '[Metric: Omni_Fairness]',
    },
    evidence: {
      calculation_logic: 'Justice_Access_Index',
      verification_status: 'Balanced',
    },
    hash_lock: 'p013_hash_secured',
  },
  {
    uuid: 'OMNI-P-014-OMNI-MIND',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: 'The Omni-Mind',
      subTitle: 'AWAKENED: INTEGRATION',
      visualStyle: 'Neural Network Brain, Synaptic Fireworks, White & Gold Core',
    },
    stats: { E: 99, S: 99, G: 99 },
    logicGate: {
      source_origin: 'sys_archetype_014',
      lifecycle_hooks: ['awakened', 'integrated'],
      formula_ref: '[Metric: System_Singularity]',
    },
    evidence: {
      calculation_logic: 'Total_Intelligence_Sum',
      verification_status: 'Online',
    },
    hash_lock: 'p014_hash_secured',
  },
  {
    uuid: 'OMNI-P-015-ZERO-POINT',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Persona',
    metadata: {
      title: 'The Zero-Point Agent',
      subTitle: 'AWAKENED: POTENTIAL',
      visualStyle: 'Singularity Black Hole, Event Horizon, Pure Energy Beam',
    },
    stats: { E: 0, S: 0, G: 0 },
    logicGate: {
      source_origin: 'sys_archetype_015',
      lifecycle_hooks: ['awakened', 'reset'],
      formula_ref: '[Metric: Infinite_Potential]',
    },
    evidence: {
      calculation_logic: 'Possibility_Space_Size',
      verification_status: 'Undefined',
    },
    hash_lock: 'p015_hash_secured',
  },
]);

// ============================================================================
// 2. SKILL DECKS (Initial Set)
// ============================================================================
export const OMNI_SKILL_DECK: readonly IESCardCore[] = Object.freeze([
  {
    uuid: 'OMNI-S-001-HYPER-THREAD',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Skill',
    metadata: {
      title: 'Hyper-Threading',
      subTitle: 'PASSIVE: SPEED BOOST',
      visualStyle: 'Blue Lightning Trails',
    },
    stats: { E: 0, S: 0, G: 50 },
    logicGate: {
      source_origin: 'sys_skill_001',
      lifecycle_hooks: ['learned'],
      formula_ref: '[Modifier: Speed * 1.5]',
    },
    evidence: {
      calculation_logic: 'Task_Completion_Rate',
      verification_status: 'Active',
    },
    hash_lock: 's001_hash_secured',
  },
  {
    uuid: 'OMNI-S-002-DEEP-TRACE',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Skill',
    metadata: {
      title: 'Deep Trace',
      subTitle: 'ACTIVE: AUDIT SCAN',
      visualStyle: 'Red Scanlines, Target Lock',
    },
    stats: { E: 0, S: 0, G: 80 },
    logicGate: {
      source_origin: 'sys_skill_002',
      lifecycle_hooks: ['learned'],
      formula_ref: '[Modifier: Precision * 2.0]',
    },
    evidence: {
      calculation_logic: 'Hidden_Error_Detection',
      verification_status: 'Ready',
    },
    hash_lock: 's002_hash_secured',
  },
  {
    uuid: 'OMNI-S-003-EMPATHY-BRIDGE',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Skill',
    metadata: {
      title: 'Empathy Bridge',
      subTitle: 'PASSIVE: SOCIAL BOOST',
      visualStyle: 'Warm Pink Bonding Ribbons',
    },
    stats: { E: 0, S: 60, G: 0 },
    logicGate: {
      source_origin: 'sys_skill_003',
      lifecycle_hooks: ['learned'],
      formula_ref: '[Modifier: Charisma + 30]',
    },
    evidence: {
      calculation_logic: 'Trust_Formation_Rate',
      verification_status: 'Active',
    },
    hash_lock: 's003_hash_secured',
  },
]);
