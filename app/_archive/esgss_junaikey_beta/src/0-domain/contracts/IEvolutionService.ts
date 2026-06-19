/** 🧬 演化檔案 (Evolution Profile) */
export interface EvolutionProfile {
  level: number;
  runeExp: number;
  nextLevelExp: number;
  mutationTraits: string[];
  awakeningCount: number;
  tesseractNodes: number; // [87] 4D Hypercube Nodes
  dimensionalResonance: number; // [87] Multi-dimensional state
}

/** 🧪 演化結果 */
export interface IEvolutionResult {
  leveledUp: boolean;
  newTraits: string[];
  currentProfile: EvolutionProfile;
}

/** 🏛️ 演化引擎介面 */
export interface IEvolutionEngine {
  calculateEvolution(profile: EvolutionProfile, impactMetric: string): IEvolutionResult;
}
