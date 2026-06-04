"use strict";
// In src/services/OmniAgentBus.ts (or an existing OmniAgentBus implementation)
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniAgentBus = void 0;
const OmniAgentSkillManager_1 = require("./OmniAgentSkillManager");
class OmniAgentBus {
    async invokeSkillAction(skillId, actionName, input, // Raw input from the agent's reasoning
    currentContext // Partial context to be completed
    ) {
        const skillDefinition = OmniAgentSkillManager_1.omniAgentSkillManager.getSkillById(skillId);
        if (!skillDefinition) {
            throw new Error(`Skill ${skillId} not registered.`);
        }
        const actionDefinition = skillDefinition.actions.find(a => a.name === actionName);
        if (!actionDefinition) {
            throw new Error(`Action ${actionName} not found in skill ${skillId}.`);
        }
        // --- Best Practice: Generate / Complete OmniCoreContext ---
        const omniCoreContext = {
            taskId: currentContext.taskId || `auto-generated-task-${Date.now()}`, // Generate if not present
            userId: currentContext.userId || 'system-user',
            permissions: currentContext.permissions || ['read', 'execute-skill'], // Default or derived
            environment: currentContext.environment || (process.env.NODE_ENV === 'production' ? 'production' : 'development'),
            // ... add other context fields
        };
        // Inject context into the skill's input (as per Memory Principle)
        const skillInput = { ...input, context: omniCoreContext };
        // --- Best Practice: Input Validation against Schema ---
        // In a real system, you'd validate skillInput against actionDefinition.inputSchema
        // using a JSON Schema validator (e.g., ajv).
        // For now, we'll assume validation passes.
        // if (!validateAgainstSchema(skillInput, actionDefinition.inputSchema)) {
        //   throw new Error("Skill input validation failed.");
        // }
        const skillModule = await OmniAgentSkillManager_1.omniAgentSkillManager.loadSkillModule(skillId);
        if (!skillModule[actionName]) {
            throw new Error(`Skill module for ${skillId} does not export action ${actionName}`);
        }
        console.log(`Invoking skill: ${skillId}, action: ${actionName} with context:`, omniCoreContext);
        const result = await skillModule[actionName](skillInput);
        // --- Best Practice: Output Validation against Schema ---
        // if (!validateAgainstSchema(result, actionDefinition.outputSchema)) {
        //   throw new Error("Skill output validation failed.");
        // }
        return result;
    }
}
exports.omniAgentBus = new OmniAgentBus();
//# sourceMappingURL=OmniAgentBus.js.map