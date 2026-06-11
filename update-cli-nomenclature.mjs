import fs from 'fs';

let content = fs.readFileSync('cli/omni.mjs', 'utf8');

// Replace "jules" command with "omni-jules" and update outputs
content = content.replace(/program\.command\('jules'\)/g, "program.command('omni-jules')");
content = content.replace(/Jules AI coding agent integration/g, "OmniJules (Google Jules Core) AI healer & coding agent");
content = content.replace(/\[J\] Generating code via Jules/g, "[OmniJules] Generating code via OmniJules");
content = content.replace(/Jules call via omniAgent/g, "OmniJules call via OmniAgent");
content = content.replace(/Jules generation successful/g, "OmniJules generation successful");
content = content.replace(/Jules generation failed/g, "OmniJules generation failed");
content = content.replace(/Jules call/g, "OmniJules call");
content = content.replace(/Jules session command/g, "OmniJules session command");
content = content.replace(/task description for Jules/g, "task description for OmniJules");
content = content.replace(/\[J\] Running Jules task/g, "[OmniJules] Running OmniJules task");
content = content.replace(/Jules task completed/g, "OmniJules task completed");
content = content.replace(/Jules task error/g, "OmniJules task error");
content = content.replace(/via Jules/g, "via OmniJules");
content = content.replace(/\[J\] Initiating browser task/g, "[OmniJules] Initiating browser task");
content = content.replace(/Jules Browser Task/g, "OmniJules Browser Task");

// Also update agent command description
content = content.replace(/Omni-Agent and Swarm orchestration/g, "OmniAgent (Hermes Core) and Swarm orchestration");
content = content.replace(/Omni-Agent Capability Hub/g, "OmniAgent (Hermes Core) Capability Hub");

fs.writeFileSync('cli/omni.mjs', content);
console.log('CLI updated with OmniJules and OmniAgent (Hermes) nomenclature.');
