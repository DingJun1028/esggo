// ═══════════════════════════════════════════════════════════════
// ESGGO Smart Model Router
// 根據 ESG 任務類型自動選擇最佳免費模型 + 技能整合
// ═══════════════════════════════════════════════════════════════

// 匯入技能系統（自動註冊所有 ESG 技能）
import { getSkill, getAllSkills } from './skills/registry';
import type { SkillContext } from './skills/registry';

export type { SkillContext };

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
  provider: 'groq' | 'openrouter' | 'gemini' | 'cloudflare' | 'together' | 'mistral';
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
  or_qwen80b: {
    provider: 'openrouter' as const,
    model: 'qwen/qwen3-next-80b-a3b-instruct:free',
    maxTokens: 512,
    temperature: 0.7,
    reasoning: 'Qwen 80B: 中文最強，適合 ESG 報告',
  },
  or_llama90b: {
    provider: 'openrouter' as const,
    model: 'meta-llama/llama-3.2-90b-vision:free',
    maxTokens: 512,
    temperature: 0.7,
    reasoning: 'Llama 90B Vision: 多模態，適合圖表分析',
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
  or_deepseek_r1: {
    provider: 'openrouter' as const,
    model: 'deepseek/deepseek-r1:free',
    maxTokens: 512,
    temperature: 0.6,
    reasoning: 'DeepSeek R1: 深度推理，適合複雜分析',
  },
  or_phi4: {
    provider: 'openrouter' as const,
    model: 'microsoft/phi-4:free',
    maxTokens: 256,
    temperature: 0.5,
    reasoning: 'Phi-4: 微軟輕量高效',
  },
  or_gemini20_flash: {
    provider: 'openrouter' as const,
    model: 'google/gemini-2.0-flash-exp:free',
    maxTokens: 512,
    temperature: 0.7,
    reasoning: 'Gemini 2.0 Flash: 多模態，長上下文',
  },
  or_gemma212b: {
    provider: 'openrouter' as const,
    model: 'google/gemma-2-12b-it:free',
    maxTokens: 256,
    temperature: 0.6,
    reasoning: 'Gemma 2 12B: 輕量高效',
  },
  or_commandr_plus: {
    provider: 'openrouter' as const,
    model: 'cohere/command-r-plus-08-2024:free',
    maxTokens: 512,
    temperature: 0.7,
    reasoning: 'Command R Plus: 工具呼叫與搜尋',
  },

  // Cloudflare AI Workers (免費 10K req/day)
  cf_llama70b: {
    provider: 'cloudflare' as const,
    model: '@cf/meta/llama-3.3-70b-instruct-fp16',
    maxTokens: 256,
    temperature: 0.7,
    reasoning: 'Cloudflare Llama 70B: 全球邊緣節點，低延遲',
  },
  cf_llama8b: {
    provider: 'cloudflare' as const,
    model: '@cf/meta/llama-3.1-8b-instruct-fp16',
    maxTokens: 256,
    temperature: 0.5,
    reasoning: 'Cloudflare Llama 8B: 輕量快速',
  },
  cf_mistral7b: {
    provider: 'cloudflare' as const,
    model: '@cf/mistralai/mistral-7b-instruct-v0.2',
    maxTokens: 256,
    temperature: 0.6,
    reasoning: 'Cloudflare Mistral 7B: 均衡輕量',
  },

  // Together.ai (免費 $25/月額度)
  tg_llama70b: {
    provider: 'together' as const,
    model: 'meta-llama/Llama-3-70b-chat-hf',
    maxTokens: 512,
    temperature: 0.7,
    reasoning: 'Together Llama 70B: 高品質推理',
  },
  tg_qwen72b: {
    provider: 'together' as const,
    model: 'Qwen/Qwen2.5-72B-Instruct-Turbo',
    maxTokens: 512,
    temperature: 0.7,
    reasoning: 'Together Qwen 72B: 中文強',
  },

  // Mistral AI (免費 tier)
  mistral_mistral: {
    provider: 'mistral' as const,
    model: 'mistral-large-latest',
    maxTokens: 512,
    temperature: 0.7,
    reasoning: 'Mistral Large: 高品質通用',
  },
  mistral_mistral_small: {
    provider: 'mistral' as const,
    model: 'mistral-small-latest',
    maxTokens: 256,
    temperature: 0.6,
    reasoning: 'Mistral Small: 快速輕量',
  },
} as const;

// ── 任務類型 → 最佳模型路由表 ────────────────────────────────
const ROUTING_TABLE: Record<ESGTaskType, RoutingResult> = {
  // ISO 14064 碳排計算: 需要精確數字推理
  carbon_calculation: {
    primary: MODELS.groq_llama70b_instruct, // Llama 70B 處理大量數據
    fallback1: MODELS.or_qwen80b,        // Qwen 中文數學強
    fallback2: MODELS.cf_llama70b,        // Cloudflare 全球邊緣
    taskType: 'carbon_calculation',
    strategy: '長上下文 + 數學推理',
  },

  // CSRD/GRI 合規審查: 需要深度理解法規
  compliance_review: {
    primary: MODELS.or_qwen80b,          // 中文法規理解最強
    fallback1: MODELS.or_llama90b,     // 90B 複雜推理
    fallback2: MODELS.tg_llama70b,       // Together 高品質
    taskType: 'compliance_review',
    strategy: '中文法規理解 + 深度推理',
  },

  // GRI 報告草稿: 需要結構化輸出
  gri_report_draft: {
    primary: MODELS.or_qwen80b,          // 中文報告生成最強
    fallback1: MODELS.or_llama90b,
    fallback2: MODELS.tg_qwen72b,        // Together Qwen 中文
    taskType: 'gri_report_draft',
    strategy: '結構化中文報告生成',
  },

  // 帳單 OCR 提取: 需要精確提取
  evidence_ocr: {
    primary: MODELS.groq_llama8b,        // 輕量快速
    fallback1: MODELS.cf_llama8b,        // Cloudflare 輕量
    fallback2: MODELS.mistral_mistral_small, // Mistral 小模型
    taskType: 'evidence_ocr',
    strategy: '快速精確提取',
  },

  // 郵件自動歸檔: 需要分類能力
  email_archival: {
    primary: MODELS.groq_llama8b,        // 極速分類
    fallback1: MODELS.cf_llama8b,        // Cloudflare 分類
    fallback2: MODELS.mistral_mistral_small,
    taskType: 'email_archival',
    strategy: '極速分類',
  },

  // 問卷分析: 需要統計分析
  stakeholder_analysis: {
    primary: MODELS.groq_llama70b_instruct, // Llama 70B 處理大量問卷
    fallback1: MODELS.or_qwen80b,
    fallback2: MODELS.tg_llama70b,
    taskType: 'stakeholder_analysis',
    strategy: '長上下文統計分析',
  },

  // 自動修復: 需要程式碼理解
  omni_jules_heal: {
    primary: MODELS.or_llama90b,       // 90B 處理複雜邏輯
    fallback1: MODELS.groq_llama70b,
    fallback2: MODELS.tg_llama70b,
    taskType: 'omni_jules_heal',
    strategy: '複雜邏輯推理',
  },

  // 蜂群調度: 需要快速決策
  swarm_orchestration: {
    primary: MODELS.groq_llama8b,        // 極速決策
    fallback1: MODELS.cf_llama8b,
    fallback2: MODELS.mistral_mistral_small,
    taskType: 'swarm_orchestration',
    strategy: '極速決策',
  },

  // TCFD 氣候風險分析: 需要深度分析
  tcfd_analysis: {
    primary: MODELS.or_qwen80b,          // 中文氣候分析
    fallback1: MODELS.or_llama90b,
    fallback2: MODELS.tg_qwen72b,
    taskType: 'tcfd_analysis',
    strategy: '深度氣候風險分析',
  },

  // SDG 目標對應: 需要知識庫匹配
  sdg_mapping: {
    primary: MODELS.groq_llama70b,       // 快速知識匹配
    fallback1: MODELS.or_qwen80b,
    fallback2: MODELS.cf_llama70b,
    taskType: 'sdg_mapping',
    strategy: '快速知識匹配',
  },

  // 重大性矩陣: 需要優先級排序
  materiality_matrix: {
    primary: MODELS.or_qwen80b,          // 中文優先級分析
    fallback1: MODELS.or_llama90b,
    fallback2: MODELS.tg_qwen72b,
    taskType: 'materiality_matrix',
    strategy: '優先級排序分析',
  },

  // 報告組裝: 需要結構化輸出
  report_assembly: {
    primary: MODELS.or_qwen80b,          // 結構化報告
    fallback1: MODELS.or_llama90b,
    fallback2: MODELS.tg_llama70b,
    taskType: 'report_assembly',
    strategy: '結構化報告組裝',
  },

  // 通用任務: 均衡配置
  general: {
    primary: MODELS.groq_llama70b,       // 速度 + 品質均衡
    fallback1: MODELS.cf_llama70b,        // Cloudflare 全球邊緣
    fallback2: MODELS.mistral_mistral,    // Mistral 高品質
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

// ── 技能整合 ─────────────────────────────────────────────────

/**
 * 根據任務類型獲取對應的 ESG 技能
 */
export function getESGSkill(taskType: string) {
  return getSkill(taskType);
}

/**
 * 獲取所有可用的 ESG 技能列表
 */
export function getAvailableSkills() {
  return getAllSkills().map(skill => skill.getInfo());
}

/**
 * 為指定任務生成完整的提示詞（系統 + 用戶）
 */
export function generatePrompts(taskType: string, ctx: SkillContext) {
  const skill = getSkill(taskType);
  if (!skill) {
    return {
      system: '你是 ESG GO 的 AI 助手，請用繁體中文回答 ESG 相關問題。',
      user: ctx.data ? JSON.stringify(ctx.data) : '',
      skillId: null,
    };
  }

  return {
    system: skill.systemPrompt(ctx),
    user: skill.userPrompt(ctx),
    skillId: skill.id,
  };
}

// ── Cloudflare AI Workers API ─────────────────────────────────

export interface CloudflareAIResponse {
  result: {
    response: string;
  };
  success: boolean;
  errors: string[];
}

/**
 * 呼叫 Cloudflare AI Workers API
 */
export async function callCloudflareAI(
  model: string,
  messages: Array<{ role: string; content: string }>,
  options: {
    maxTokens?: number;
    temperature?: number;
    stream?: boolean;
  } = {}
): Promise<CloudflareAIResponse> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error('Cloudflare credentials not configured');
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        max_tokens: options.maxTokens || 256,
        temperature: options.temperature || 0.7,
        stream: options.stream || false,
      }),
    }
  );

  const data = await response.json() as CloudflareAIResponse;

  if (!data.success) {
    throw new Error(`Cloudflare AI error: ${JSON.stringify(data.errors)}`);
  }

  return data;
}

/**
 * 驗證 Cloudflare API Token
 */
export async function validateCloudflareToken(): Promise<boolean> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) return false;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/tokens/verify`,
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
      }
    );
    const data = await response.json() as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

/**
 * 後處理 AI 回應（套用技能特定的後處理）
 */
export function postProcessResponse(taskType: string, response: string, ctx: SkillContext): string {
  const skill = getSkill(taskType);
  if (!skill) return response;
  return skill.postProcess(response, ctx);
}
