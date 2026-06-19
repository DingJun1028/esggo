import { IESCardCore } from '../types/cards';

export interface GoldenMission {
  id: string;
  mentorId: string; // Links to EsgWorldMap location IDs
  title: string;
  description: string;
  difficulty: 'Normal' | 'Hard' | 'Legendary';
  rewards: {
    itk: number;
    cardUuid?: string; // The Omni Card earned
    badge?: string;
  };
  objectives: string[];
  isUnlockable: boolean;
  scenarioId?: string; // Optional: Links to a specific interactive scenario
}

export const GOLDEN_ALLIANCE_MISSIONS: GoldenMission[] = [
  // --- Dr. Sushi: The Visionary (王道精神) ---
  {
    id: 'msn_sushi_01',
    mentorId: 'dr_sushi',
    title: 'The Stakeholder Balance',
    description:
      "A conflict has arisen between shareholders demanding profit and a local community fearing pollution. Design a 'Mutual Benefit Contract' that satisfies both.",
    difficulty: 'Legendary',
    rewards: {
      itk: 5000,
      cardUuid: 'UK-S-SROI-003', // SROI Calculator
      badge: "Visionary's Seal",
    },
    objectives: [
      'Conduct Stakeholder Interview (Simulated)',
      'Draft Mutual Benefit Proposal',
      'Achieve Satisfaction > 80% for both parties',
    ],
    isUnlockable: true,
    scenarioId: 'ilan_forest',
  },
  // --- CEO: The Executor (高效實踐) ---
  {
    id: 'msn_ceo_01',
    mentorId: 'catalyst_ceo',
    title: 'Velocity Construction',
    description:
      'The village needs a new renewable energy grid, but time is short. Optimize the construction workflow to reduce lead time by 30% without compromising safety.',
    difficulty: 'Hard',
    rewards: {
      itk: 3000,
      cardUuid: 'UK-E-RE100-002', // RE100
      badge: 'Speed Demon',
    },
    objectives: [
      'Analyze Critical Path',
      "Deploy 'High-Biao High-Xiao' Protocols",
      'Complete Grid before the storm hits',
    ],
    isUnlockable: true,
  },
  // --- Sam Wells: Tech Vanguard (數據核心) ---
  {
    id: 'msn_tech_01',
    mentorId: 'tech_vanguard',
    title: 'The Blockchain Bridge',
    description:
      "Legacy data systems are fragmented. Build a bridge to the 'Omni-Component Core' to ensure all carbon credits are traceable and immutable.",
    difficulty: 'Hard',
    rewards: {
      itk: 4000,
      cardUuid: 'UK-G-ID-004', // Omni Omni-ID
      badge: 'Protocol Master',
    },
    objectives: ['Map Data Sources', 'Implement Hash Locks', 'Verify 100% Data Integrity'],
    isUnlockable: true,
    scenarioId: 'carbon_paradox',
  },
  // --- Adan Wang: The Strategist (全球佈局) ---
  {
    id: 'msn_adan_01',
    mentorId: 'adan_wang',
    title: 'Global Materiality Matrix',
    description:
      'The market is shifting. Perform a Double Materiality assessment to identify the true risks and opportunities for the next decade.',
    difficulty: 'Legendary',
    rewards: {
      itk: 6000,
      cardUuid: 'UK-G-MAT-003', // Double Materiality Matrix
      badge: 'Grand Strategist',
    },
    objectives: [
      'Assess Financial Impact',
      'Assess Impact on People/Environment',
      'Plot the Matrix',
    ],
    isUnlockable: true,
  },
  {
    id: 'msn_boss_01',
    mentorId: 'adan_wang', // Associate with Strategist
    title: 'BOSS: The Gilded Facade',
    description:
      'A massive Greenwashing entity has been detected in the Asian market sector. It threatens to corrupt the entire ESG ledger. Neutralize it immediately.',
    difficulty: 'Legendary',
    rewards: {
      itk: 50000,
      badge: 'Greenwashing Slayer',
    },
    objectives: [
      'Survive the Litigation Storm',
      'Expose the False Data',
      'Defeat the Avatar of Greenwashing',
    ],
    isUnlockable: true,
    scenarioId: 'BOSS:greenwashing',
  },
  // --- JunAiKey: The Core Architect (奧秘架構) ---
  {
    id: 'msn_core_01',
    mentorId: 'jun_ai_key',
    title: 'The Origin Key Blueprint',
    description:
      "Design a new component for the village that adheres strictly to the '3-Audit 1-Immutable' protocol. This is the final test of an Architect.",
    difficulty: 'Legendary',
    rewards: {
      itk: 10000,
      cardUuid: 'UK-U-ORIGIN-KEY', // The Omni Origin Key (Concept)
      badge: 'Sovereign Architect',
    },
    objectives: ['Define Component Specs', 'Pass 4+1 Logic Gate', 'Mint the Blueprint'],
    isUnlockable: true,
  },
  // --- COO: Systems Orchestrator (系統流轉) ---
  {
    id: 'msn_coo_01',
    mentorId: 'systems_coo',
    title: 'Entropy Reduction Protocol',
    description:
      'Resource waste is detected in the supply chain. Orchestrate a new flow that turns waste into value (Circular Economy).',
    difficulty: 'Hard',
    rewards: {
      itk: 3500,
      cardUuid: 'UK-E-CIRC-004', // Circular Economy
      badge: 'System Harmonizer',
    },
    objectives: ['Audit Waste Streams', 'Design Circular Loop', 'Achieve Zero Waste Target'],
    isUnlockable: true,
  },
];
