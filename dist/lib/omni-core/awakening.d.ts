/**
 * OmniAgent Awakening Talent (萬能智庫·神經共享)
 * 全域神經同步機制：一點習得，全網賦能。
 * 遵循 5T 協議 (Transferful: 生命週期即時追蹤與可追蹤性)
 */
import { OmniSkill } from '../agents/omni-agent-bus.ts';
export interface IOmniAgentAwakening {
    readonly uuid: string;
    syncAbility(skill: OmniSkill): Promise<void>;
    skillLibrary: Map<string, OmniSkill>;
    toggleSkill(skillId: string, state: 'loaded' | 'unloaded'): void;
}
export declare class OmniAgentAwakening implements IOmniAgentAwakening {
    readonly uuid: string;
    skillLibrary: Map<string, OmniSkill>;
    constructor();
    private registerHooks;
    syncAbility(skill: OmniSkill): Promise<void>;
    onOtherAgentLearned(newSkill: OmniSkill): Promise<void>;
    toggleSkill(skillId: string, state: 'loaded' | 'unloaded'): void;
}
export declare const omniAgentAwakening: OmniAgentAwakening;
//# sourceMappingURL=awakening.d.ts.map