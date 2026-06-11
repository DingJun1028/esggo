// In a new file, e.g., src/services/OmniAgentSkillManager.ts

    import * as fs from 'fs';
    import * as path from 'path';
    import { validateSkillDefinition } from './skillValidation';
    import { OmniAgentSkillRegistry, SkillDefinition } from '../types/omniagent';

    class OmniAgentSkillManager {
      private skills: Map<string, SkillDefinition>;
      private skillModules: Map<string, Record<string, (...args: unknown[]) => unknown>>; // Cache for loaded skill modules

      constructor() {
        this.skills = new Map();
        this.skillModules = new Map();
        this.loadSkillDefinitions();
      }

      private loadSkillDefinitions() {
        // Support Next.js standalone mode by checking alternative paths
        let registryPath = path.join(process.cwd(), 'config', 'omniagent-skills.json');
        if (!fs.existsSync(registryPath)) {
          const altPath1 = path.join(process.cwd(), '..', '..', 'config', 'omniagent-skills.json');
          const altPath2 = path.join(process.cwd(), '..', 'config', 'omniagent-skills.json');
          if (fs.existsSync(altPath1)) {
            registryPath = altPath1;
          } else if (fs.existsSync(altPath2)) {
            registryPath = altPath2;
          }
        }

        if (!fs.existsSync(registryPath)) {
          console.warn(`OmniAgentSkillManager: Skill registry not found at ${registryPath}`);
          return;
        }

        const registryContent = fs.readFileSync(registryPath, 'utf-8');
        const registry: OmniAgentSkillRegistry = JSON.parse(registryContent);

        for (const skill of registry.skills) {
          if (validateSkillDefinition(skill)) {
            this.skills.set(skill.skillId, skill);
            console.log(`Registered skill: ${skill.skillId}`);
          } else {
            console.error(`Invalid skill definition for ${skill.skillId}`);
          }
        }
      }

      public getSkillById(skillId: string): SkillDefinition | undefined {
        return this.skills.get(skillId);
      }

      public findSkillsByCapability(query: string): SkillDefinition[] {
        // Implement logic to search skill descriptions/action descriptions
        // This could use vector embeddings or keyword matching
        return Array.from(this.skills.values()).filter(skill =>
          skill.description.includes(query) ||
          skill.actions.some(action => action.description.includes(query))
        );
      }

      public async loadSkillModule(skillId: string): Promise<Record<string, (...args: unknown[]) => unknown>> {
        if (this.skillModules.has(skillId)) {
          return this.skillModules.get(skillId)!;
        }

        const skill = this.getSkillById(skillId);
        if (!skill) {
          throw new Error(`Skill ${skillId} not found.`);
        }

        // Dynamically import the skill module
        // Support Next.js standalone mode: find root directory of the project
        let projectRoot = process.cwd();
        if (projectRoot.endsWith('.next/standalone') || projectRoot.endsWith('.next\\standalone')) {
          projectRoot = path.join(projectRoot, '..', '..');
        } else if (projectRoot.includes('.next/standalone') || projectRoot.includes('.next\\standalone')) {
          projectRoot = projectRoot.replace(/[/\\]\.next[/\\]standalone.*$/, '');
        }

        const modulePath = path.resolve(projectRoot, skill.entryPoint);

        // If it's a TypeScript file, we register ts-node to compile it on the fly
        if (modulePath.endsWith('.ts')) {
          try {
            // Using eval("require") to dynamically register ts-node without webpack bundling it
            const dynamicRequire = eval('require');
            const tsNode = dynamicRequire('ts-node');
            tsNode.register({
              transpileOnly: true,
              compilerOptions: {
                module: 'commonjs'
              }
            });
          } catch (e) {
            console.warn('[OmniAgentSkillManager] ts-node not available or failed to register. Attempting default import.');
          }
        }

        console.log(`[OmniAgentSkillManager] Loading skill module from: ${modulePath}`);
        const skillModule = (await import(modulePath)) as Record<string, (...args: unknown[]) => unknown>;
        this.skillModules.set(skillId, skillModule);
        return skillModule;
      }
    }

    export const omniAgentSkillManager = new OmniAgentSkillManager();
