// In a new file, e.g., src/services/OmniAgentSkillManager.ts
import * as fs from 'fs';
import * as path from 'path';
import { validateSkillDefinition } from './skillValidation';
class OmniAgentSkillManager {
    constructor() {
        this.skills = new Map();
        this.skillModules = new Map();
        this.loadSkillDefinitions();
    }
    loadSkillDefinitions() {
        // In a real system, this would load from a database or multiple config files
        const registryPath = path.join(process.cwd(), 'config', 'omniagent-skills.json');
        if (!fs.existsSync(registryPath)) {
            console.warn(`OmniAgentSkillManager: Skill registry not found at ${registryPath}`);
            return;
        }
        const registryContent = fs.readFileSync(registryPath, 'utf-8');
        const registry = JSON.parse(registryContent);
        for (const skill of registry.skills) {
            if (validateSkillDefinition(skill)) {
                this.skills.set(skill.skillId, skill);
                console.log(`Registered skill: ${skill.skillId}`);
            }
            else {
                console.error(`Invalid skill definition for ${skill.skillId}`);
            }
        }
    }
    getSkillById(skillId) {
        return this.skills.get(skillId);
    }
    findSkillsByCapability(query) {
        // Implement logic to search skill descriptions/action descriptions
        // This could use vector embeddings or keyword matching
        return Array.from(this.skills.values()).filter(skill => skill.description.includes(query) ||
            skill.actions.some(action => action.description.includes(query)));
    }
    async loadSkillModule(skillId) {
        if (this.skillModules.has(skillId)) {
            return this.skillModules.get(skillId);
        }
        const skill = this.getSkillById(skillId);
        if (!skill) {
            throw new Error(`Skill ${skillId} not found.`);
        }
        // Dynamically import the skill module
        // This assumes skills are local Node.js modules
        const modulePath = path.join(process.cwd(), skill.entryPoint);
        const skillModule = (await import(modulePath));
        this.skillModules.set(skillId, skillModule);
        return skillModule;
    }
}
export const omniAgentSkillManager = new OmniAgentSkillManager();
//# sourceMappingURL=OmniAgentSkillManager.js.map