import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), '..');
const SRC = path.join(ROOT, 'esggo', 'shared', 'types.ts');
const DEST = path.join(process.cwd(), 'types', 'generated', 'esggo-shared.d.ts');

const SRC_REL = path.relative(path.join(process.cwd(), 'types', 'generated'), SRC).replace(/\\/g, '/');

const LIC = `/* Auto-generated from \`esggo/shared/types.ts\` — do not edit. */\n`;

const map = [
  ['ESGKnowledgeBase', 'enum'],
  ['ARVOStage', 'enum'],
  ['SkillCategory', 'enum'],
  ['MasteryLevel', 'enum'],
  ['IKnowledgeRecord', 'interface'],
  ['IRAGResult', 'interface'],
  ['IARVOPlan', 'interface'],
  ['IAgentProfile', 'interface'],
  ['ISkillNode', 'interface'],
  ['IAwakeningResult', 'interface'],
  ['IHITLProposal', 'interface'],
  ['IServiceModule', 'interface'],
  ['IEsgMetric', 'interface'],
  ['IEvidenceRecord', 'interface'],
  ['IMaterialityTopic', 'interface'],
  ['ISupplyChainVendor', 'interface'],
  ['IUserProfile', 'interface'],
  ['ICommunityPost', 'interface'],
  ['IVillageMember', 'interface'],
  ['IOmniNote', 'interface'],
  ['IApiResult', 'interface'],
];

const content = fs.readFileSync(SRC, 'utf-8');
const lines = content.split('\n');

function findExportBlock(name, kind) {
  const head = 'export ' + kind + ' ' + name + '<';
  const headPlain = 'export ' + kind + ' ' + name + ' ';
  let start = -1;
  let braces = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (start === -1 && (l.startsWith(head) || l.startsWith(headPlain) || l.startsWith('export type ' + name + ' '))) {
      start = i;
    }
    if (start !== -1) {
      braces += (l.match(/{/g) || []).length;
      braces -= (l.match(/}/g) || []).length;
      if (braces <= 0) return lines.slice(start, i + 1).join('\n');
    }
  }
  return '';
}

const out = [];
const added = new Set();
for (const [name, kind] of map) {
  if (added.has(name)) continue;
  added.add(name);
  const block = findExportBlock(name, kind);
  if (block) out.push(block, '');
}

fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.writeFileSync(DEST, out.join('\n').trim() + '\n', 'utf-8');
console.log(`OK ${path.relative(process.cwd(), DEST)}`);
