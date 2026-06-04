/**
 * 🏛️ 萬能架構 12維度 (Universal Architecture 12 Dimensions)
 * v1.0 | #OmniArchitecture #12D #5TIntegrity
 *
 * 奧義六式 → 12維度治理體系 → 萬能架構完備
 */
import type { MissionResult } from '../agents/omni-commander.ts';
export type OmniDimension = 'Core' | 'Rune' | 'Agent' | 'Memory' | 'Sync' | 'Protocol' | 'Evolution' | 'Monitor' | 'Security' | 'Meta' | 'Tag' | 'Theme';
export interface DimensionState {
    name: OmniDimension;
    status: 'Optimal' | 'Active' | 'Swarming' | 'Stable' | 'Healthy' | 'Enforced' | 'Streaming' | 'Hardened' | 'Defined' | 'Indexed' | 'Applied';
    description: string;
    entropy: number;
    lastUpdate: string;
}
export interface UniversalArchitecture {
    dimensions: DimensionState[];
    systemEntropy: number;
    isHealthy: boolean;
    lastCalibration: string;
}
export declare class OmniArchitectureEngine {
    private static instance;
    private _dimensions;
    private constructor();
    static getInstance(): OmniArchitectureEngine;
    private initializeDimensions;
    /**
     * 觸壤任意維度狀態
     */
    updateDimension(name: OmniDimension, status: DimensionState['status'], entropy?: number): void;
    /**
     * 獲取完整架構狀態
     */
    getArchitecture(): UniversalArchitecture;
    /**
     * 觸發12維度校準
     */
    calibrate(): Promise<MissionResult>;
}
export declare const architectureEngine: OmniArchitectureEngine;
//# sourceMappingURL=architecture.d.ts.map