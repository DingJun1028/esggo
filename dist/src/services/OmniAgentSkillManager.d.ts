import { SkillDefinition } from '../types/omniagent';
declare class OmniAgentSkillManager {
    private skills;
    private skillModules;
    constructor();
    private loadSkillDefinitions;
    getSkillById(skillId: string): SkillDefinition | undefined;
    findSkillsByCapability(query: string): SkillDefinition[];
    loadSkillModule(skillId: string): Promise<Record<string, (...args: unknown[]) => unknown>>;
}
export declare const omniAgentSkillManager: OmniAgentSkillManager;
export {};
//# sourceMappingURL=OmniAgentSkillManager.d.ts.map