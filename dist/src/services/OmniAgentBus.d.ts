import { OmniCoreContext } from '../types/omniagent';
declare class OmniAgentBus {
    invokeSkillAction(skillId: string, actionName: string, input: Record<string, unknown>, // Raw input from the agent's reasoning
    currentContext: Partial<OmniCoreContext>): Promise<unknown>;
}
export declare const omniAgentBus: OmniAgentBus;
export {};
//# sourceMappingURL=OmniAgentBus.d.ts.map