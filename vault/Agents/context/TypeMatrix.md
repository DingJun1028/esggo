---
source_origin: esggo/shared/types.ts
created: 2026-08-13
modified: 2026-08-12
sync: mirror
co_authors: []
lifecycle: active
---

# 型別矩陣鏡像（TypeScript 終始矩陣 · vault 端）

> 本檔由 `scripts/sync-types-to-vault.ts` 從 `esggo/shared/types.ts` 自動生成（sync:mirror）。
> 人類可讀鏡像，與各端 `types/generated/esggo-shared.d.ts` 同步。
> 若需新增型別：先在 vault 筆記標 `sync:up` 寫 ts code-block → 跑 `sync-vault-types.ts` → 合入 canonical。

## 統計
- 總型別：36
- enum：5
- interface：27
- type：4

## 索引（wikilink）
### Enum
- [[ESGKnowledgeBase]] (enum)
- [[ARVOStage]] (enum)
- [[SkillCategory]] (enum)
- [[MasteryLevel]] (enum)
- [[TranslateEngine]] (enum)

### Interface
- [[IKnowledgeRecord]] (interface)
- [[IRAGResult]] (interface)
- [[IARVOPlan]] (interface)
- [[IAgentProfile]] (interface)
- [[ISkillNode]] (interface)
- [[IAwakeningResult]] (interface)
- [[IHITLProposal]] (interface)
- [[IServiceModule]] (interface)
- [[IEsgMetric]] (interface)
- [[IEvidenceRecord]] (interface)
- [[IMaterialityTopic]] (interface)
- [[ISupplyChainVendor]] (interface)
- [[IUserProfile]] (interface)
- [[ICommunityPost]] (interface)
- [[IVillageMember]] (interface)
- [[IOmniNote]] (interface)
- [[IApiResult]] (interface)
- [[ITranslateRequest]] (interface)
- [[ITranslateResult]] (interface)
- [[ISpeakPayload]] (interface)
- [[ISseTranslationEvent]] (interface)
- [[ISpeechToSubtitleRequest]] (interface)
- [[ISpeechToSubtitleResult]] (interface)
- [[IOmniTypeMatrix]] (interface)
- [[IZoomMeeting]] (interface)
- [[IPlayerState]] (interface)
- [[ISecondBrainNote]] (interface)

### Type
- [[LanguageCode]] (type)
- [[BilingualPair]] (type)
- [[PlayerSourceKind]] (type)
- [[IPlayerSource]] (type)

## 定義詳列
### ESGKnowledgeBase
```ts
export enum ESGKnowledgeBase {
  ESG_STANDARDS = 'esg_standards',
  GRI_STANDARDS = 'gri_standards',
  TCFD_FRAMEWORK = 'tcfd_framework',
  SASB_STANDARDS = 'sasb_standards',
  SDGS_GOALS = 'sdgs_goals',
  CARBON_EMISSION = 'carbon_emission',
  ESG_REGULATIONS = 'esg_regulations',
  BEST_PRACTICES = 'best_practices',
}
```

### IKnowledgeRecord
```ts
export interface IKnowledgeRecord {
  id: string;
  content: string;
  source: string;
  kb: ESGKnowledgeBase;
  metadata?: Record<string, any>;
  embedding?: number[];
  createdAt: number;
}
```

### IRAGResult
```ts
export interface IRAGResult {
  answer: string;
  sources: { content: string; source: string; score: number }[];
  confidence: number;
  tokensUsed?: number;
}
```

### ARVOStage
```ts
export enum ARVOStage {
  ANALYZE = 'ANALYZE',
  REASON = 'REASON',
  VERIFY = 'VERIFY',
  ORCHESTRATE = 'ORCHESTRATE',
}
```

### IARVOPlan
```ts
export interface IARVOPlan {
  taskId: string;
  currentStage: ARVOStage;
  findings: string[];
  reasoning: string;
  verificationStatus: 'PENDING' | 'PASSED' | 'FAILED';
  skillsRequired: string[];
}
```

### IAgentProfile
```ts
export interface IAgentProfile {
  id: string;
  name: string;
  role: string;
  skills: string[];
  status: 'IDLE' | 'BUSY' | 'EVOLVING';
  memory_pt: number;
}
```

### SkillCategory
```ts
export enum SkillCategory {
  ESG_ANALYSIS = 'ESG_ANALYSIS',
  CARBON_ACCOUNTING = 'CARBON_ACCOUNTING',
  REGULATORY_COMPLIANCE = 'REGULATORY_COMPLIANCE',
  STAKEHOLDER_ENGAGEMENT = 'STAKEHOLDER_ENGAGEMENT',
  DATA_VERIFICATION = 'DATA_VERIFICATION',
}
```

### MasteryLevel
```ts
export enum MasteryLevel {
  NOVICE = 'NOVICE',
  APPRENTICE = 'APPRENTICE',
  JOURNEYMAN = 'JOURNEYMAN',
  EXPERT = 'EXPERT',
  MASTER = 'MASTER',
}
```

### ISkillNode
```ts
export interface ISkillNode {
  id: string;
  uuid?: string;
  name: string;
  layer: number; // 0-7
  category: SkillCategory;
  description: string;
  hitlRequired: boolean;
  level: MasteryLevel;
  experience: number;
  unlocked_at?: string;
  certificate_hash?: string;
}
```

### IAwakeningResult
```ts
export interface IAwakeningResult {
  thought: string;
  action: string;
  reasoning: string;
  confidence: number;
  metadata?: Record<string, any>;
  skill_points_earned?: number;
}
```

### IHITLProposal
```ts
export interface IHITLProposal {
  id: string;
  agentId: string;
  action: string;
  parameters: any;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rationale: string;
}
```

### IServiceModule
```ts
export interface IServiceModule {
  id: string;
  uuid: string;
  name: string;
  route: string;
  domain: string;
}
```

### IEsgMetric
```ts
export interface IEsgMetric {
  id: string;
  metric_id?: string;
  category: "E" | "S" | "G";
  year: number;
  name: string;
  metric_name?: string;
  value: number;
  target_value?: number;
  unit: string;
  status: string;
}
```

### IEvidenceRecord
```ts
export interface IEvidenceRecord {
  id: string;
  record_id: string;
  type: string;
  timestamp: string;
  hash: string;
  status: string;
  variant: "optimal" | "critical" | "lethal";
  owner_id?: string;
}
```

### IMaterialityTopic
```ts
export interface IMaterialityTopic {
  id: string;
  topic_name: string;
  category: "E" | "S" | "G";
  business_impact: number;
  stakeholder_importance: number;
  description?: string;
}
```

### ISupplyChainVendor
```ts
export interface ISupplyChainVendor {
  id: string;
  vendor_name: string;
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  compliance_score: number;
  carbon_emission: number;
  risk_level: "Low" | "Medium" | "High" | "Critical";
  last_audit_date: string;
  status: "Active" | "Under Review" | "Suspended";
}
```

### IUserProfile
```ts
export interface IUserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar_url?: string;
  goodness_coins: number;
  sustainability_gems: number;
}
```

### ICommunityPost
```ts
export interface ICommunityPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: string;
  likes: number;
  created_at: string;
}
```

### IVillageMember
```ts
export interface IVillageMember {
  id: string;
  user_id: string;
  village_name: string;
  level: number;
  title: string;
  reputation: number;
}
```

### IOmniNote
```ts
export interface IOmniNote {
  id: string;
  note_id: string;
  type: "no-action" | "insight";
  title: string;
  content: string;
  variant: "optimal" | "critical" | "lethal";
  dimensions: {
    truthful: number;
    transferful: number;
    thankful: number;
    tasteful: number;
    trustful: number;
  };
  tags: string[];
  created_at: string;
  updated_at: string;
  spirit_feedback?: string;
  hash?: string;
}
```

### IApiResult
```ts
export interface IApiResult<T> {
  data: T;
  error?: any;
}
```

### TranslateEngine
```ts
export enum TranslateEngine {
  GOOGLE_GTX = 'google-gtx',
  LIBRETRANSLATE = 'libretranslate',
  MYMEMORY = 'mymemory',
  OLLAMA = 'ollama',
  PASSTHROUGH = 'passthrough',
  FALLBACK_ORIGIN = 'fallback-origin',
}
```

### LanguageCode
```ts
export type LanguageCode =
  | 'auto' | 'zh' | 'zh-CN' | 'zh-TW' | 'zh-Hant'
  | 'en' | 'ja' | 'ko' | 'es' | 'fr';

/** /translate 單語請求 */
export interface ITranslateRequest {
  text: string;
  /** 來源語碼 (運行期允許任意 string) */
  from?: string;
  /** 目標語碼 (運行期允許任意 string) */
  to?: string;
  /** 多語平行翻譯目標 (即時轉播場景) */
  targets?: LanguageCode[];
  /** 房間隔離 (SSE 多房間) */
  room?: string;
}
```

### ITranslateRequest
```ts
export interface ITranslateRequest {
  text: string;
  /** 來源語碼 (運行期允許任意 string) */
  from?: string;
  /** 目標語碼 (運行期允許任意 string) */
  to?: string;
  /** 多語平行翻譯目標 (即時轉播場景) */
  targets?: LanguageCode[];
  /** 房間隔離 (SSE 多房間) */
  room?: string;
}
```

### ITranslateResult
```ts
export interface ITranslateResult {
  text: string;
  /** 引擎識別字串 (對齊 TranslateEngine 枚舉值, 但以 string 寬鬆容許運行期動態引擎) */
  engine: string;
  cached: boolean;
  version?: string;
}
```

### ISpeakPayload
```ts
export interface ISpeakPayload {
  text: string;
  /** 來源語碼 (運行期允許任意 string, 引擎層再做規範化) */
  from?: string;
  /** 目標語碼 (運行期允許任意 string) */
  to?: string;
  targets?: LanguageCode[];
  room?: string;
  speaker?: string;
}
```

### ISseTranslationEvent
```ts
export interface ISseTranslationEvent {
  text: string;
  translations: Partial<Record<LanguageCode, string>>;
  engines?: Partial<Record<LanguageCode, string>>;
  /** 單語場景的引擎識別字串 (對齊 TranslateEngine) */
  engine?: string;
  cached?: boolean;
  trace?: string;
  room?: string;
  speaker?: string;
  /** 跨句脈絡記憶: 近期前文 (供 UI 顯示「前文」, 提升連貫) */
  context?: Array<{ src: string; tgt?: string }>;
}
```

### BilingualPair
```ts
export type BilingualPair = 'zh-TW-en' | 'en-zh-TW';

/** /transcribe 請求契約 (音訊由 multipart 帶入, 此處僅描述 metadata) */
export interface ISpeechToSubtitleRequest {
  /** 語言提示 (鎖定雙向, 禁其他) */
  languageHint?: 'zh-TW' | 'en';
  /** 房間隔離 (SSE 多房間) */
  room?: string;
  /** 講者標籤 (5T 溯源) */
  speaker?: string;
}
```

### ISpeechToSubtitleRequest
```ts
export interface ISpeechToSubtitleRequest {
  /** 語言提示 (鎖定雙向, 禁其他) */
  languageHint?: 'zh-TW' | 'en';
  /** 房間隔離 (SSE 多房間) */
  room?: string;
  /** 講者標籤 (5T 溯源) */
  speaker?: string;
}
```

### ISpeechToSubtitleResult
```ts
export interface ISpeechToSubtitleResult {
  /** 原始辨識文字 */
  text: string;
  /** STT 偵測語 (鎖定雙向) */
  detected: 'zh-TW' | 'en';
  /** 即時翻譯對向: zh-TW→en 或 en→zh-TW */
  translation: string;
  /** 翻譯目標語 */
  target: 'zh-TW' | 'en';
  /** 引擎識別字串 (5T 溯源: stt:whisper + ollama:<model>) */
  engine: string;
  /** 是否命中快取 */
  cached: boolean;
  /** 溯源追蹤碼 */
  trace?: string;
}
```

### IOmniTypeMatrix
```ts
export interface IOmniTypeMatrix {
  canonical: 'esggo/shared/types.ts';
  generator: 'scripts/export-shared-types.js';
  consumers: string[]; // 各端 types/generated/esggo-shared.d.ts 路徑
}
```

### PlayerSourceKind
```ts
export type PlayerSourceKind = 'file' | 'url' | 'zoom';

/** 播放器來源聯合 (繁中英碼終始矩陣雙向同步) */
export type IPlayerSource =
  | { kind: 'file'; file: File }
```

### IPlayerSource
```ts
export type IPlayerSource =
  | { kind: 'file'; file: File }
```

### IZoomMeeting
```ts
export interface IZoomMeeting {
  /** Zoom 會議號 (選填, 僅作展示) */
  meetingId?: string;
  /** 會議原文語言 (對齊 LanguageCode) */
  sourceLang: LanguageCode;
  /** 是否為線上直播中 */
  isLive: boolean;
}
```

### IPlayerState
```ts
export interface IPlayerState {
  sourceKind: PlayerSourceKind;
  isPlaying: boolean;
  isCaptioning: boolean;
  lastCaption?: { src: string; translations: Partial<Record<LanguageCode, string>> };
}
```

### ISecondBrainNote
```ts
export interface ISecondBrainNote {
  id: string;
  title: string;
  tags: string[];
  source_origin: string;
  sync: 'mirror' | 'up';
}
```

