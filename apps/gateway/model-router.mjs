/**
 * ESGGO Smart Model Router (Gateway Version)
 * 根據 ESG 任務類型自動選擇最佳免費模型
 */

// ── 任務類型推斷 ─────────────────────────────────────────────
export function inferTaskType(message) {
  const lowerMsg = (message || '').toLowerCase();

  if (lowerMsg.match(/碳排|carbon|ghg|排放量|iso.?14064|scope/)) return 'carbon_calculation';
  if (lowerMsg.match(/合規|compliance|csrd|gri.?報告|法規|審查/)) return 'compliance_review';
  if (lowerMsg.match(/tcfd|氣候|climate|風險分析|淨零|net.?zero/)) return 'tcfd_analysis';
  if (lowerMsg.match(/sdg|永續發展目標|聯合國/)) return 'sdg_mapping';
  if (lowerMsg.match(/重大性|materiality|矩陣|priority/)) return 'materiality_matrix';
  if (lowerMsg.match(/ocr|帳單|收據|發票|提取|extract/)) return 'evidence_ocr';
  if (lowerMsg.match(/問卷|survey|利害關係人|stakeholder|分析/)) return 'stakeholder_analysis';
  if (lowerMsg.match(/報告|report|draft|草稿|撰寫/)) return 'gri_report_draft';
  if (lowerMsg.match(/修復|fix|bug|debug|error|錯誤/)) return 'omni_jules_heal';
  if (lowerMsg.match(/郵件|email|歸檔|archive/)) return 'email_archival';
  if (lowerMsg.match(/蜂群|swarm|orchestrat|調度|協調/)) return 'swarm_orchestration';

  return 'general';
}

// ── 模型配置 ─────────────────────────────────────────────────
  // OpenRouter :free (品質王, 200 req/day)
  or_qwen80b:    { provider: 'openrouter', model: 'qwen/qwen3-next-80b-a3b-instruct:free',    maxTokens: 512, temperature: 0.7 },
  or_llama90b:   { provider: 'openrouter', model: 'meta-llama/llama-3.2-90b-vision:free',     maxTokens: 512, temperature: 0.7 },
  or_llama70b:   { provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct:free',   maxTokens: 256, temperature: 0.7 },
  or_mistral24b: { provider: 'openrouter', model: 'mistralai/mistral-small-3.1-24b:free',     maxTokens: 256, temperature: 0.6 },
  or_gemma31b:   { provider: 'openrouter', model: 'google/gemma-4-31b-it:free',               maxTokens: 256, temperature: 0.6 },
  or_deepseek_r1:    { provider: 'openrouter', model: 'deepseek/deepseek-r1:free',           maxTokens: 512, temperature: 0.6 },
  or_phi4:          { provider: 'openrouter', model: 'microsoft/phi-4:free',                 maxTokens: 256, temperature: 0.5 },
  or_gemini20_flash: { provider: 'openrouter', model: 'google/gemini-2.0-flash-exp:free',    maxTokens: 512, temperature: 0.7 },
  or_gemma212b:     { provider: 'openrouter', model: 'google/gemma-2-12b-it:free',           maxTokens: 256, temperature: 0.6 },
  or_commandr_plus: { provider: 'openrouter', model: 'cohere/command-r-plus-08-2024:free',   maxTokens: 512, temperature: 0.7 },

// ── 路由表 ───────────────────────────────────────────────────
const ROUTING_TABLE = {
  carbon_calculation:    { primary: MODELS.groq_llama70b, fallback1: MODELS.or_qwen80b,    fallback2: MODELS.groq_llama8b },
  compliance_review:     { primary: MODELS.or_qwen80b,   fallback1: MODELS.or_llama90b, fallback2: MODELS.groq_llama70b },
  gri_report_draft:      { primary: MODELS.or_qwen80b,   fallback1: MODELS.or_llama90b, fallback2: MODELS.groq_llama70b },
  tcfd_analysis:         { primary: MODELS.or_qwen80b,   fallback1: MODELS.or_llama90b, fallback2: MODELS.groq_llama70b },
  sdg_mapping:           { primary: MODELS.groq_llama70b, fallback1: MODELS.or_qwen80b,   fallback2: MODELS.or_mistral24b },
  materiality_matrix:    { primary: MODELS.or_qwen80b,   fallback1: MODELS.or_llama90b, fallback2: MODELS.groq_llama70b },
  evidence_ocr:          { primary: MODELS.groq_llama8b,  fallback1: MODELS.groq_gemma,   fallback2: MODELS.or_mistral24b },
  email_archival:        { primary: MODELS.groq_llama8b,  fallback1: MODELS.groq_gemma,   fallback2: MODELS.or_mistral24b },
  stakeholder_analysis:  { primary: MODELS.groq_llama70b, fallback1: MODELS.or_qwen80b,   fallback2: MODELS.groq_llama8b },
  omni_jules_heal:       { primary: MODELS.or_llama90b, fallback1: MODELS.groq_llama70b, fallback2: MODELS.or_llama70b },
  swarm_orchestration:   { primary: MODELS.groq_llama8b,  fallback1: MODELS.groq_gemma,   fallback2: MODELS.or_mistral24b },
  general:               { primary: MODELS.groq_llama70b, fallback1: MODELS.or_llama70b,   fallback2: MODELS.or_mistral24b },
};

// ── 路由函數 ─────────────────────────────────────────────────
export function routeModel(taskType) {
  const normalizedType = (taskType || 'general').toLowerCase();
  return ROUTING_TABLE[normalizedType] || ROUTING_TABLE.general;
}

export function formatRoutingResult(result, taskType) {
  return `[${taskType}] Primary: ${result.primary.provider}/${result.primary.model} | Fallback1: ${result.fallback1.provider}/${result.fallback1.model}`;
}
