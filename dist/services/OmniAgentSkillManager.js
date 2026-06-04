"use strict";
// In a new file, e.g., src/services/OmniAgentSkillManager.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniAgentSkillManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const skillValidation_1 = require("./skillValidation");
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
            if ((0, skillValidation_1.validateSkillDefinition)(skill)) {
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
        const skillModule = (await Promise.resolve(`${modulePath}`).then(s => __importStar(require(s))));
        this.skillModules.set(skillId, skillModule);
        return skillModule;
    }
}
exports.omniAgentSkillManager = new OmniAgentSkillManager();
//# sourceMappingURL=OmniAgentSkillManager.js.map