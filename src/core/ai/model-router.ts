// ═══════════════════════════════════════════════════════════════
// ESGGO Smart Model Router
// 根據 ESG 任務類型自動選擇最佳免費模型
// ═══════════════════════════════════════════════════════════════

export type ESGTaskType =
  | 'carbon_calculation'    // ISO 14064 碳排計算
  | 'compliance_review'     // CSRD/GRI 合規審查
  | 'gri_report_draft'      // GRI 報告草稿
  | 'evidence_ocr'          // 帳單 OCR 提取
  | 'email_archival'        // 郵件自動歸檔
  | 'stakeholder_analysis'  // 問卷分析
  | 'omni_jules_heal'       // 自動修復
  | 'swarm_orchestration'   // 蜂群調度
  | 'tcfd_analysis'         // TCFD 氣候風險分析
  | 'sdg_mapping'           // SDG 目標對應
  | 'materiality_matrix'    // 重大性矩陣
  | 'report_assembly'       // 報告組裝
  | 'general';              // 通用任務

export interface ModelConfig {
  provider: 'groq' | 'openrouter' | 'gemini';
  model: string;
  maxTokens: number;
  temperature: number;
  reasoning: string; // 選擇原因
}

export interface RoutingResult {
  primary: ModelConfig;
  fallback1: ModelConfig;
  fallback2: ModelConfig;
  taskType: ESGTaskType;
  strategy: string;
}

// ── 模型能力矩陣 ─────────────────────────────────────────────
// Groq: 速度最快 (3-5x), 30 req/min, 無每日上限
// OpenRouter :free: 模型最多 (11個), 200 req/day
// Gemini: 長上下文, 多模態

const MODELS = {
  // Groq 模型 (速度王)
  groq_llama70b: {
    provider: 'groq' as const,
    model: 'llama-3.3-70b-versatile',
    maxTokens: 256,
    temperature: 0.7,
    reasoning: 'Groq Llama 70B: 最快速度，適合即時回應',
  },
  groq_llama8b: {
    provider: 'groq' as const,
    model: 'llama-3.1-8b-instant',
    maxTokens: 256,
    temperature: 0.5,
    reasoning: 'Groq Llama 8B: 極速輕量，適合簡單分類',
  },
  groq_gemma: {
    provider: 'groq' as const,
    model: 'gemma2-9b-it',
    maxTokens: 256,
    temperature: 0.6,
    reasoning: 'Groq Gemma 9B: 均衡輕量',
  },
  groq_llama70b_instruct: {
    provider: 'groq' as const,
    model: 'llama-3.3-70b-versatile',
    maxTokens: 512,
    temperature: 0.7,
    reasoning: 'Groq Llama 70B Instruct: 長上下文處理',
  },

  // OpenRouter :free 模型 (品質王)
  or_hermes405b: {
    provider: 'openrouter' as const,
    model: 'nousresearch/hermes-3-llama-3.1-405b:free',
    maxTokens: 512,
    temperature: 0.7,
    reasoning: 'Hermes 405B: 最大免費模型，複雜推理',
  },
  or_llama90b: {
    provider: 'openrouter' as const,
    model: 'meta-llama/llama-3.2-90b-vision:free',
    maxTokens: 512,
    temperature: 0.7,
    reasoning: 'Llama 90B Vision: 多模態，適合圖表分析',
  },
  or_qwen80b: {
    provider: 'openrouter' as const,
    model: 'qwen/qwen3-next-80b-a3b-instruct:free',
    maxTokens: 512,
    temperature: 0.7,
    reasoning: 'Qwen 80B: 中文最強，適合 ESG 報告',
  },
  or_mistral24b: {
    provider: 'openrouter' as const,
    model: 'mistralai/mistral-small-3.1-24b:free',
    maxTokens: 256,
    temperature: 0.6,
    reasoning: 'Mistral 24B: 均衡中型',
  },
  or_gemma31b: {
    provider: 'openrouter' as const,
    model: 'google/gemma-4-31b-it:free',
    maxTokens: 256,
    temperature: 0.6,
    reasoning: 'Gemma 31B: Google 品質',
  },
  or_llama70b: {
    provider: 'openrouter' as const,
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    maxTokens: 256,
    temperature: 0.7,
    reasoning: 'Llama 70B: 通用高品質',
  },
} as const;

// ── 任務類型 → 最佳模型路由表 ────────────────────────────────
const ROUTING_TABLE: Record<ESGTaskType, RoutingResult> = {
  // ISO 14064 碳排計算: 需要精確數字推理
  carbon_calculation: {
    primary: MODELS.groq_llama70b_instruct, // Llama 70B 處理大量數據
    fallback1: MODELS.or_qwen80b,        // Qwen 中文數學強
    fallback2: MODELS.groq_llama70b,
    taskType: 'carbon_calculation',
    strategy: '長上下文 + 數學推理',
  },

  // CSRD/GRI 合規審查: 需要深度理解法規
  compliance_review: {
    primary: MODELS.or_qwen80b,          // 中文法規理解最強
    fallback1: MODELS.or_hermes405b,     // 405B 複雜推理
    fallback2: MODELS.groq_llama70b,
    taskType: 'compliance_review',
    strategy: '中文法規理解 + 深度推理',
  },

  // GRI 報告草稿: 需要結構化輸出
  gri_report_draft: {
    primary: MODELS.or_qwen80b,          // 中文報告生成最強
    fallback1: MODELS.or_hermes405b,
    fallback2: MODELS.groq_llama70b,
    taskType: 'gri_report_draft',
    strategy: '結構化中文報告生成',
  },

  // 帳單 OCR 提取: 需要精確提取
  evidence_ocr: {
    primary: MODELS.groq_llama8b,        // 輕量快速
    fallback1: MODELS.groq_gemma,
    fallback2: MODELS.or_mistral24b,
    taskType: 'evidence_ocr',
    strategy: '快速精確提取',
  },

  // 郵件自動歸檔: 需要分類能力
  email_archival: {
    primary: MODELS.groq_llama8b,        // 極速分類
    fallback1: MODELS.groq_gemma,
    fallback2: MODELS.or_mistral24b,
    taskType: 'email_archival',
    strategy: '極速分類',
  },

  // 問卷分析: 需要統計分析
  stakeholder_analysis: {
    primary: MODELS.groq_llama70b_instruct, // Llama 70B 處理大量問卷
    fallback1: MODELS.or_qwen80b,
    fallback2: MODELS.groq_llama70b,
    taskType: 'stakeholder_analysis',
    strategy: '長上下文統計分析',
  },

  // 自動修復: 需要程式碼理解
  omni_jules_heal: {
    primary: MODELS.or_hermes405b,       // 最大模型處理複雜邏輯
    fallback1: MODELS.groq_llama70b,
    fallback2: MODELS.or_llama70b,
    taskType: 'omni_jules_heal',
    strategy: '複雜邏輯推理',
  },

  // 蜂群調度: 需要快速決策
  swarm_orchestration: {
    primary: MODELS.groq_llama8b,        // 極速決策
    fallback1: MODELS.groq_gemma,
    fallback2: MODELS.or_mistral24b,
    taskType: 'swarm_orchestration',
    strategy: '極速決策',
  },

  // TCFD 氣候風險分析: 需要深度分析
  tcfd_analysis: {
    primary: MODELS.or_qwen80b,          // 中文氣候分析
    fallback1: MODELS.or_hermes405b,
    fallback2: MODELS.groq_llama70b_instruct,
    taskType: 'tcfd_analysis',
    strategy: '深度氣候風險分析',
  },

  // SDG 目標對應: 需要知識庫匹配
  sdg_mapping: {
    primary: MODELS.groq_llama70b,       // 快速知識匹配
    fallback1: MODELS.or_qwen80b,
    fallback2: MODELS.or_mistral24b,
    taskType: 'sdg_mapping',
    strategy: '快速知識匹配',
  },

  // 重大性矩陣: 需要優先級排序
  materiality_matrix: {
    primary: MODELS.or_qwen80b,          // 中文優先級分析
    fallback1: MODELS.or_hermes405b,
    fallback2: MODELS.groq_llama70b,
    taskType: 'materiality_matrix',
    strategy: '優先級排序分析',
  },

  // 報告組裝: 需要結構化輸出
  report_assembly: {
    primary: MODELS.or_qwen80b,          // 結構化報告
    fallback1: MODELS.or_hermes405b,
    fallback2: MODELS.groq_llama70b,
    taskType: 'report_assembly',
    strategy: '結構化報告組裝',
  },

  // 通用任務: 均衡配置
  general: {
    primary: MODELS.groq_llama70b,       // 速度 + 品質均衡
    fallback1: MODELS.or_llama70b,
    fallback2: MODELS.or_mistral24b,
    taskType: 'general',
    strategy: '速度與品質均衡',
  },
};

// ── 智慧路由函數 ─────────────────────────────────────────────

/**
 * 根據任務類型選擇最佳模型路由
 */
export function routeModel(taskType: string): RoutingResult {
  const normalizedType = (taskType || 'general').toLowerCase() as ESGTaskType;
  return ROUTING_TABLE[normalizedType] || ROUTING_TABLE.general;
}

/**
 * 根據用戶訊息自動推斷任務類型
 */
export function inferTaskType(message: string): ESGTaskType {
  const lowerMsg = message.toLowerCase();

  // 碳排計算關鍵詞
  if (lowerMsg.match(/碳排|carbon|ghg|排放量|iso.?14064| Scope/)) {
    return 'carbon_calculation';
  }

  // 合規審查關鍵詞
  if (lowerMsg.match(/合規|compliance|csrd|gri.?報告|法規|審查/)) {
    return 'compliance_review';
  }

  // TCFD 氣候風險
  if (lowerMsg.match(/tcfd|氣候|climate|風險分析|淨零|net.?zero/)) {
    return 'tcfd_analysis';
  }

  // SDG 目標
  if (lowerMsg.match(/sdg|永續發展目標|聯合國/)) {
    return 'sdg_mapping';
  }

  // 重大性矩陣
  if (lowerMsg.match(/重大性|materiality|矩陣|priority/)) {
    return 'materiality_matrix';
  }

  // OCR 提取
  if (lowerMsg.match(/ocr|帳單|收據|發票|提取|extract/)) {
    return 'evidence_ocr';
  }

  // 問卷分析
  if (lowerMsg.match(/問卷|survey|利害關係人|stakeholder|分析/)) {
    return 'stakeholder_analysis';
  }

  // 報告相關
  if (lowerMsg.match(/報告|report|draft|草稿|撰寫/)) {
    return 'gri_report_draft';
  }

  // 修復相關
  if (lowerMsg.match(/修復|fix|bug|debug|error|錯誤/)) {
    return 'omni_jules_heal';
  }

  // 郵件歸檔
  if (lowerMsg.match(/郵件|email|歸檔|archive/)) {
    return 'email_archival';
  }

  // 蜂群調度
  if (lowerMsg.match(/蜂群|swarm|orchestrat|調度|協調/)) {
    return 'swarm_orchestration';
  }

  return 'general';
}

/**
 * 獲取所有可用模型列表
 */
export function getAvailableModels(): Record<string, ModelConfig> {
  return { ...MODELS };
}

/**
 * 獲取路由表（用於調試）
 */
export function getRoutingTable(): Record<string, RoutingResult> {
  return { ...ROUTING_TABLE };
}

/**
 * 格式化路由結果為可讀字串
 */
export function formatRoutingResult(result: RoutingResult): string {
  return `[${result.taskType}] Strategy: ${result.strategy} | Primary: ${result.primary.provider}/${result.primary.model} | Fallback1: ${result.fallback1.provider}/${result.fallback1.model} | Fallback2: ${result.fallback2.provider}/${result.fallback2.model}`;
}
