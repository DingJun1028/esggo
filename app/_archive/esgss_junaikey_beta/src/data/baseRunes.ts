/**
 * 基礎符文庫
 * Base Rune Library
 *
 * 30+ 原子符文，對應 7 層架構
 */

import { type Rune, RuneCategory, ProficiencyLevel } from '../types/runeArts';

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

// ============================================================================
// 感知符文 (Perception Runes)
// ============================================================================

export const PERCEPTION_RUNES: Rune[] = [
  {
    id: 'rune_vision_analyze',
    name: '視覺分析',
    description: '分析圖像內容，識別物體、場景和文字',
    category: RuneCategory.PERCEPTION,
    type: 'atomic',
    capability: {
      input: ['image_url', 'image_data'],
      output: ['objects', 'scene', 'text', 'confidence'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['vision', 'perception', 'image'],
    },
  },
  {
    id: 'rune_audio_transcribe',
    name: '語音轉文字',
    description: '將音訊轉換為文字，支援多語言',
    category: RuneCategory.PERCEPTION,
    type: 'atomic',
    capability: {
      input: ['audio_url', 'audio_data', 'language'],
      output: ['text', 'confidence', 'timestamps'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['audio', 'perception', 'transcription'],
    },
  },
  {
    id: 'rune_sentiment_analyze',
    name: '情感分析',
    description: '分析文本的情感傾向和情緒強度',
    category: RuneCategory.PERCEPTION,
    type: 'atomic',
    capability: {
      input: ['text'],
      output: ['sentiment', 'score', 'emotions'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['sentiment', 'perception', 'nlp'],
    },
  },
];

// ============================================================================
// 記憶符文 (Memory Runes)
// ============================================================================

export const MEMORY_RUNES: Rune[] = [
  {
    id: 'rune_memory_store',
    name: '記憶儲存',
    description: '將資訊儲存到長期記憶中',
    category: RuneCategory.MEMORY,
    type: 'atomic',
    capability: {
      input: ['content', 'type', 'metadata'],
      output: ['memory_id', 'stored_at'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['memory', 'storage', 'persistence'],
    },
  },
  {
    id: 'rune_memory_recall',
    name: '記憶檢索',
    description: '從記憶中檢索相關資訊',
    category: RuneCategory.MEMORY,
    type: 'atomic',
    capability: {
      input: ['query', 'type', 'limit'],
      output: ['memories', 'relevance_scores'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['memory', 'retrieval', 'search'],
    },
  },
  {
    id: 'rune_context_summarize',
    name: '上下文摘要',
    description: '整合多個記憶片段，生成精煉摘要',
    category: RuneCategory.MEMORY,
    type: 'atomic',
    capability: {
      input: ['memories', 'max_length'],
      output: ['summary', 'key_points'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['memory', 'summarization', 'context'],
    },
  },
];

// ============================================================================
// 推理符文 (Reasoning Runes)
// ============================================================================

export const REASONING_RUNES: Rune[] = [
  {
    id: 'rune_task_decompose',
    name: '任務分解',
    description: '將複雜任務分解為可執行的子任務',
    category: RuneCategory.REASONING,
    type: 'atomic',
    capability: {
      input: ['task', 'constraints'],
      output: ['subtasks', 'dependencies'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['reasoning', 'planning', 'decomposition'],
    },
  },
  {
    id: 'rune_logic_reasoning',
    name: '邏輯推理',
    description: '基於事實和規則進行邏輯推理',
    category: RuneCategory.REASONING,
    type: 'atomic',
    capability: {
      input: ['facts', 'rules', 'query'],
      output: ['conclusion', 'reasoning_chain', 'confidence'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['reasoning', 'logic', 'inference'],
    },
  },
  {
    id: 'rune_decision_making',
    name: '決策制定',
    description: '評估選項並做出最優決策',
    category: RuneCategory.REASONING,
    type: 'atomic',
    capability: {
      input: ['options', 'criteria', 'weights'],
      output: ['decision', 'scores', 'rationale'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['reasoning', 'decision', 'optimization'],
    },
  },
  {
    id: 'rune_pattern_recognize',
    name: '模式識別',
    description: '從數據中識別模式和趨勢',
    category: RuneCategory.REASONING,
    type: 'atomic',
    capability: {
      input: ['data', 'pattern_type'],
      output: ['patterns', 'confidence', 'insights'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['reasoning', 'pattern', 'analysis'],
    },
  },
];

// ============================================================================
// 行動符文 (Action Runes)
// ============================================================================

export const ACTION_RUNES: Rune[] = [
  {
    id: 'rune_web_search',
    name: '網路搜尋',
    description: '在網路上搜尋資訊',
    category: RuneCategory.ACTION,
    type: 'atomic',
    capability: {
      input: ['query', 'max_results'],
      output: ['results', 'sources'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['action', 'search', 'web'],
    },
  },
  {
    id: 'rune_text_generate',
    name: '文本生成',
    description: '生成高品質文本內容',
    category: RuneCategory.ACTION,
    type: 'atomic',
    capability: {
      input: ['prompt', 'style', 'length'],
      output: ['text', 'metadata'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['action', 'generation', 'text'],
    },
  },
  {
    id: 'rune_code_execute',
    name: '代碼執行',
    description: '安全執行代碼片段',
    category: RuneCategory.ACTION,
    type: 'atomic',
    capability: {
      input: ['code', 'language', 'timeout'],
      output: ['result', 'stdout', 'stderr'],
      sideEffects: ['execution'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['action', 'code', 'execution'],
    },
  },
  {
    id: 'rune_database_query',
    name: '資料庫查詢',
    description: '查詢資料庫並返回結果',
    category: RuneCategory.ACTION,
    type: 'atomic',
    capability: {
      input: ['query', 'database', 'params'],
      output: ['rows', 'count'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['action', 'database', 'query'],
    },
  },
  {
    id: 'rune_api_call',
    name: 'API 呼叫',
    description: '呼叫外部 API 服務',
    category: RuneCategory.ACTION,
    type: 'atomic',
    capability: {
      input: ['url', 'method', 'headers', 'body'],
      output: ['response', 'status'],
      sideEffects: ['network'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['action', 'api', 'network'],
    },
  },
  {
    id: 'rune_file_read',
    name: '檔案讀取',
    description: '讀取檔案內容',
    category: RuneCategory.ACTION,
    type: 'atomic',
    capability: {
      input: ['path', 'encoding'],
      output: ['content', 'metadata'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['action', 'file', 'io'],
    },
  },
  {
    id: 'rune_file_write',
    name: '檔案寫入',
    description: '寫入內容到檔案',
    category: RuneCategory.ACTION,
    type: 'atomic',
    capability: {
      input: ['path', 'content', 'encoding'],
      output: ['success', 'bytes_written'],
      sideEffects: ['filesystem'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['action', 'file', 'io'],
    },
  },
  {
    id: 'rune_chart_generate',
    name: '圖表生成',
    description: '生成數據視覺化圖表',
    category: RuneCategory.ACTION,
    type: 'atomic',
    capability: {
      input: ['data', 'chart_type', 'options'],
      output: ['chart_url', 'chart_data'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['action', 'visualization', 'chart'],
    },
  },
  {
    id: 'rune_report_generate',
    name: '報告生成',
    description: '生成結構化報告文檔',
    category: RuneCategory.ACTION,
    type: 'atomic',
    capability: {
      input: ['data', 'template', 'format'],
      output: ['report_url', 'report_data'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['action', 'report', 'document'],
    },
  },
];

// ============================================================================
// 通訊符文 (Communication Runes)
// ============================================================================

export const COMMUNICATION_RUNES: Rune[] = [
  {
    id: 'rune_email_send',
    name: '發送郵件',
    description: '發送電子郵件',
    category: RuneCategory.COMMUNICATION,
    type: 'atomic',
    capability: {
      input: ['to', 'subject', 'body', 'attachments'],
      output: ['message_id', 'status'],
      sideEffects: ['email'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['communication', 'email', 'notification'],
    },
  },
  {
    id: 'rune_notification_create',
    name: '創建通知',
    description: '創建系統通知',
    category: RuneCategory.COMMUNICATION,
    type: 'atomic',
    capability: {
      input: ['title', 'message', 'priority'],
      output: ['notification_id', 'delivered'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['communication', 'notification', 'alert'],
    },
  },
  {
    id: 'rune_message_format',
    name: '訊息格式化',
    description: '格式化訊息為特定格式',
    category: RuneCategory.COMMUNICATION,
    type: 'atomic',
    capability: {
      input: ['content', 'format', 'options'],
      output: ['formatted_message'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['communication', 'formatting', 'message'],
    },
  },
  {
    id: 'rune_translation',
    name: '語言翻譯',
    description: '翻譯文本到目標語言',
    category: RuneCategory.COMMUNICATION,
    type: 'atomic',
    capability: {
      input: ['text', 'source_lang', 'target_lang'],
      output: ['translated_text', 'confidence'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['communication', 'translation', 'language'],
    },
  },
];

// ============================================================================
// 安全符文 (Safety Runes)
// ============================================================================

export const SAFETY_RUNES: Rune[] = [
  {
    id: 'rune_content_filter',
    name: '內容過濾',
    description: '過濾不當或危險內容',
    category: RuneCategory.SAFETY,
    type: 'atomic',
    capability: {
      input: ['content', 'rules'],
      output: ['filtered_content', 'violations'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['safety', 'filter', 'moderation'],
    },
  },
  {
    id: 'rune_risk_assess',
    name: '風險評估',
    description: '評估操作的潛在風險',
    category: RuneCategory.SAFETY,
    type: 'atomic',
    capability: {
      input: ['action', 'context'],
      output: ['risk_level', 'concerns', 'recommendations'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['safety', 'risk', 'assessment'],
    },
  },
  {
    id: 'rune_compliance_check',
    name: '合規檢查',
    description: '檢查是否符合法規要求',
    category: RuneCategory.SAFETY,
    type: 'atomic',
    capability: {
      input: ['data', 'regulations'],
      output: ['compliant', 'issues', 'suggestions'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['safety', 'compliance', 'regulation'],
    },
  },
];

// ============================================================================
// 學習符文 (Learning Runes)
// ============================================================================

export const LEARNING_RUNES: Rune[] = [
  {
    id: 'rune_skill_propose',
    name: '技能提案',
    description: '提出新技能建議',
    category: RuneCategory.LEARNING,
    type: 'atomic',
    capability: {
      input: ['context', 'needs'],
      output: ['proposals', 'rationale'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['learning', 'evolution', 'proposal'],
    },
  },
  {
    id: 'rune_feedback_learn',
    name: '反饋學習',
    description: '從反饋中學習並優化',
    category: RuneCategory.LEARNING,
    type: 'atomic',
    capability: {
      input: ['feedback', 'context'],
      output: ['insights', 'adjustments'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['learning', 'feedback', 'optimization'],
    },
  },
  {
    id: 'rune_performance_analyze',
    name: '性能分析',
    description: '分析自身性能並提出改進',
    category: RuneCategory.LEARNING,
    type: 'atomic',
    capability: {
      input: ['metrics', 'history'],
      output: ['analysis', 'recommendations'],
    },
    proficiency: {
      level: ProficiencyLevel.NOVICE,
      usageCount: 0,
      successRate: 1.0,
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0.0',
      tags: ['learning', 'performance', 'analysis'],
    },
  },
];

// ============================================================================
// 符文庫匯總
// ============================================================================

export const ALL_BASE_RUNES: Rune[] = [
  ...PERCEPTION_RUNES,
  ...MEMORY_RUNES,
  ...REASONING_RUNES,
  ...ACTION_RUNES,
  ...COMMUNICATION_RUNES,
  ...SAFETY_RUNES,
  ...LEARNING_RUNES,
];

export const RUNE_COUNT = {
  perception: PERCEPTION_RUNES.length,
  memory: MEMORY_RUNES.length,
  reasoning: REASONING_RUNES.length,
  action: ACTION_RUNES.length,
  communication: COMMUNICATION_RUNES.length,
  safety: SAFETY_RUNES.length,
  learning: LEARNING_RUNES.length,
  total: ALL_BASE_RUNES.length,
};

omniLogger.info(LogCategory.SYSTEM, '[baseRunes] Info', { data: `[Rune Library] 📚 載入 ${RUNE_COUNT.total} 個基礎符文` });
omniLogger.info(LogCategory.SYSTEM, '[baseRunes] Info', { data: `[Rune Library]    感知: ${RUNE_COUNT.perception}` });
omniLogger.info(LogCategory.SYSTEM, '[baseRunes] Info', { data: `[Rune Library]    記憶: ${RUNE_COUNT.memory}` });
omniLogger.info(LogCategory.SYSTEM, '[baseRunes] Info', { data: `[Rune Library]    推理: ${RUNE_COUNT.reasoning}` });
omniLogger.info(LogCategory.SYSTEM, '[baseRunes] Info', { data: `[Rune Library]    行動: ${RUNE_COUNT.action}` });
omniLogger.info(LogCategory.SYSTEM, '[baseRunes] Info', { data: `[Rune Library]    通訊: ${RUNE_COUNT.communication}` });
omniLogger.info(LogCategory.SYSTEM, '[baseRunes] Info', { data: `[Rune Library]    安全: ${RUNE_COUNT.safety}` });
omniLogger.info(LogCategory.SYSTEM, '[baseRunes] Info', { data: `[Rune Library]    學習: ${RUNE_COUNT.learning}` });
