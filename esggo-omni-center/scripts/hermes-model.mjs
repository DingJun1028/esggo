#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// Hermes Free Model 切換助手
// 讀取 model/hermes-free-models.json，產生 Hermes Agent 切換指令，
// 並可列出任務類型的免費模型故障轉移鏈。
//
// 用法：
//   node scripts/hermes-model.mjs list                 # 列出所有免費模型
//   node scripts/hermes-model.mjs set <id>             # 產生切換指令
//   node scripts/hermes-model.mjs default              # 顯示預設模型
//   node scripts/hermes-model.mjs pool <taskType>      # 顯示某任務的回落鏈
// ═══════════════════════════════════════════════════════════════

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, '..', 'model', 'hermes-free-models.json');

function loadConfig() {
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  } catch (e) {
    console.error(`✗ 無法讀取配置檔 ${CONFIG_PATH}: ${e.message}`);
    process.exit(1);
  }
}

const ESG_TASK_TYPES = [
  'carbon_calculation', 'compliance_review', 'gri_report_draft', 'evidence_ocr',
  'email_archival', 'stakeholder_analysis', 'omni_jules_heal', 'swarm_orchestration',
  'tcfd_analysis', 'sdg_mapping', 'materiality_matrix', 'report_assembly', 'general',
];

// 與 model-router.ts ROUTING_TABLE 保持一致的本地回落鏈（避免依賴 TS 編譯）。
const ROUTING = {
  carbon_calculation:   ['groq:llama-3.3-70b-versatile', 'openrouter:qwen/qwen3-next-80b-a3b-instruct:free', 'cloudflare:@cf/meta/llama-3.3-70b-instruct-fp16'],
  compliance_review:    ['openrouter:qwen/qwen3-next-80b-a3b-instruct:free', 'openrouter:meta-llama/llama-3.2-90b-vision:free', 'together:meta-llama/Llama-3-70b-chat-hf'],
  gri_report_draft:     ['openrouter:qwen/qwen3-next-80b-a3b-instruct:free', 'openrouter:meta-llama/llama-3.2-90b-vision:free', 'together:Qwen/Qwen2.5-72B-Instruct-Turbo'],
  evidence_ocr:         ['groq:llama-3.1-8b-instant', 'cloudflare:@cf/meta/llama-3.1-8b-instruct-fp16', 'openrouter:mistralai/mistral-small-3.1-24b:free'],
  email_archival:       ['groq:llama-3.1-8b-instant', 'cloudflare:@cf/meta/llama-3.1-8b-instruct-fp16', 'openrouter:mistralai/mistral-small-3.1-24b:free'],
  stakeholder_analysis: ['groq:llama-3.3-70b-versatile', 'openrouter:qwen/qwen3-next-80b-a3b-instruct:free', 'together:meta-llama/Llama-3-70b-chat-hf'],
  omni_jules_heal:      ['openrouter:meta-llama/llama-3.2-90b-vision:free', 'groq:llama-3.3-70b-versatile', 'together:meta-llama/Llama-3-70b-chat-hf'],
  swarm_orchestration:  ['groq:llama-3.1-8b-instant', 'cloudflare:@cf/meta/llama-3.1-8b-instruct-fp16', 'openrouter:mistralai/mistral-small-3.1-24b:free'],
  tcfd_analysis:        ['openrouter:qwen/qwen3-next-80b-a3b-instruct:free', 'openrouter:meta-llama/llama-3.2-90b-vision:free', 'together:Qwen/Qwen2.5-72B-Instruct-Turbo'],
  sdg_mapping:          ['groq:llama-3.3-70b-versatile', 'openrouter:qwen/qwen3-next-80b-a3b-instruct:free', 'openrouter:mistralai/mistral-small-3.1-24b:free'],
  materiality_matrix:   ['openrouter:qwen/qwen3-next-80b-a3b-instruct:free', 'openrouter:meta-llama/llama-3.2-90b-vision:free', 'together:Qwen/Qwen2.5-72B-Instruct-Turbo'],
  report_assembly:      ['openrouter:qwen/qwen3-next-80b-a3b-instruct:free', 'openrouter:meta-llama/llama-3.2-90b-vision:free', 'together:meta-llama/Llama-3-70b-chat-hf'],
  general:              ['groq:llama-3.3-70b-versatile', 'cloudflare:@cf/meta/llama-3.3-70b-instruct-fp16', 'openrouter:mistralai/mistral-small-3.1-24b:free'],
};

function cmdList(cfg) {
  console.log(`\n📋 ${cfg.name}（${cfg.cost}）`);
  console.log(`預設：${cfg.default}\n`);
  cfg.models.forEach((m, i) => {
    console.log(`${String(i + 1).padStart(2, '0')}. ${m.id}`);
    console.log(`    ${m.label} · ${m.provider} · ${m.strength}`);
  });
}

function cmdSet(cfg, id) {
  if (!id) { console.error('✗ 請提供模型 id，例如：node scripts/hermes-model.mjs set meta-llama/llama-3.2-90b-vision:free'); process.exit(1); }
  const found = cfg.models.find(m => m.id === id);
  if (!found) { console.error(`✗ 找不到模型：${id}`); console.error('  執行 `node scripts/hermes-model.mjs list` 查看可用清單'); process.exit(1); }
  console.log(`# 為 Hermes Agent 設定免費模型：`);
  console.log(`hermes model set ${id}`);
}

function cmdDefault(cfg) {
  console.log(cfg.default);
}

function cmdPool(taskType) {
  const key = (taskType || 'general').toLowerCase();
  const chain = ROUTING[key] || ROUTING.general;
  console.log(`\n🔀 任務 [${key}] 免費模型回落鏈：`);
  chain.forEach((m, i) => console.log(`  ${i === 0 ? '→' : ' '} ${i + 1}. ${m}`));
}

const [cmd, arg] = process.argv.slice(2);
const config = loadConfig();

switch (cmd) {
  case 'list':   cmdList(config); break;
  case 'set':    cmdSet(config, arg); break;
  case 'default':cmdDefault(config); break;
  case 'pool':   cmdPool(arg); break;
  case 'tasks':  console.log(ESG_TASK_TYPES.join('\n')); break;
  default:
    console.log('Hermes Free Model 切換助手');
    console.log('用法：');
    console.log('  node scripts/hermes-model.mjs list                 # 列出所有免費模型');
    console.log('  node scripts/hermes-model.mjs set <id>             # 產生 hermes model set 指令');
    console.log('  node scripts/hermes-model.mjs default              # 顯示預設模型');
    console.log('  node scripts/hermes-model.mjs pool <taskType>      # 顯示任務回落鏈');
    console.log('  node scripts/hermes-model.mjs tasks                # 列出所有 ESG 任務類型');
    process.exit(cmd ? 1 : 0);
}
