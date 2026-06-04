"use strict";
// Utility for validating skill definitions
// In a real scenario, this would use a robust JSON Schema validator like AJV (Another JSON Schema Validator)
// For this conceptual example, we'll do a basic structural check.
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSkillDefinition = validateSkillDefinition;
function validateSkillDefinition(skill) {
    if (!skill.skillId || typeof skill.skillId !== 'string') {
        console.error("Skill validation failed: missing or invalid 'skillId'.");
        return false;
    }
    if (!skill.description || typeof skill.description !== 'string') {
        console.error(`Skill validation failed for ${skill.skillId}: missing or invalid 'description'.`);
        return false;
    }
    if (!skill.entryPoint || typeof skill.entryPoint !== 'string') {
        console.error(`Skill validation failed for ${skill.skillId}: missing or invalid 'entryPoint'.`);
        return false;
    }
    if (!Array.isArray(skill.actions) || skill.actions.length === 0) {
        console.error(`Skill validation failed for ${skill.skillId}: missing or empty 'actions' array.`);
        return false;
    }
    for (const action of skill.actions) {
        if (!action.name || typeof action.name !== 'string') {
            console.error(`Skill validation failed for ${skill.skillId} action: missing or invalid 'name'.`);
            return false;
        }
        if (!action.description || typeof action.description !== 'string') {
            console.error(`Skill validation failed for ${skill.skillId} action ${action.name}: missing or invalid 'description'.`);
            return false;
        }
        // Basic check for schema presence, full schema validation requires a library
        if (!action.inputSchema || typeof action.inputSchema !== 'object') {
            console.error(`Skill validation failed for ${skill.skillId} action ${action.name}: missing or invalid 'inputSchema'.`);
            return false;
        }
        if (!action.outputSchema || typeof action.outputSchema !== 'object') {
            console.error(`Skill validation failed for ${skill.skillId} action ${action.name}: missing or invalid 'outputSchema'.`);
            return false;
        }
    }
    // Check memoryPrinciple if provided
    if (skill.memoryPrinciple && !['Skill-Fragmented Knowledge', 'Stateful'].includes(skill.memoryPrinciple)) {
        console.error(`Skill validation failed for ${skill.skillId}: invalid 'memoryPrinciple'.`);
        return false;
    }
    return true;
}
//# sourceMappingURL=skillValidation.js.map