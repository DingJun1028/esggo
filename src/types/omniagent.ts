// Shared types for OmniAgent skill integration
import { JSONSchema7 } from "json-schema"; // Assuming json-schema types are available or can be installed

export interface ActionDefinition {
    name: string;
    description: string;
    inputSchema: JSONSchema7;
    outputSchema: JSONSchema7;
}

export interface SkillDefinition {
    skillId: string;
    description: string;
    entryPoint: string; // Path to the skill's main module (e.g., 'path/to/skill/index.ts')
    actions: ActionDefinition[];
    definitions?: { [key: string]: JSONSchema7 }; // Re-usable schema definitions within the skill
    memoryPrinciple: "Skill-Fragmented Knowledge" | "Stateful"; // Indicate memory principle
}

export interface OmniAgentSkillRegistry {
    skills: SkillDefinition[];
}

export interface OmniCoreContext {
    taskId: string;
    userId: string;
    permissions: string[];
    environment: "development" | "staging" | "production" | "test";
    // Add other relevant context information as needed by the OmniAgent system
    [key: string]: unknown; // Allow for arbitrary additional context
}
