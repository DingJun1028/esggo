import { JSONSchema7 } from "json-schema";
export interface ActionDefinition {
    name: string;
    description: string;
    inputSchema: JSONSchema7;
    outputSchema: JSONSchema7;
}
export interface SkillDefinition {
    skillId: string;
    description: string;
    entryPoint: string;
    actions: ActionDefinition[];
    definitions?: {
        [key: string]: JSONSchema7;
    };
    memoryPrinciple: "Skill-Fragmented Knowledge" | "Stateful";
}
export interface OmniAgentSkillRegistry {
    skills: SkillDefinition[];
}
export interface OmniCoreContext {
    taskId: string;
    userId: string;
    permissions: string[];
    environment: "development" | "staging" | "production" | "test";
    [key: string]: unknown;
}
//# sourceMappingURL=omniagent.d.ts.map