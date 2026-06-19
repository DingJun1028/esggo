// 奧秘標籤 (Omni Tags) - Shared Type Definitions
// This file serves as the single source of truth for types across the system (Frontend & Backend).

// 1. 核心實體標籤 (Core Entity Tags)
export interface OmniEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ESGDataTag extends OmniEntity {
  environmental: {
    carbonFootprint: number;
    energyConsumption: number;
    waterUsage: number;
    wasteGeneration: number;
  };
  social: {
    employeeSatisfaction: number;
    diversityIndex: number;
    communityImpact: number;
    humanRightsScore: number;
  };
  governance: {
    transparencyScore: number;
    boardDiversity: number;
    ethicalCompliance: number;
    stakeholderEngagement: number;
  };
  metadata?: Record<string, unknown>;
}

// 2. 奧秘心核共鳴介面 (Omni Resonance Interface)
// Defines how the "Heart Core" (Controller/Hook) should behave.
export interface OmniResonance<T> {
  // The Data/State (Eternal Memory)
  data: T | null;
  loading: boolean;
  error: string | null;

  // Actions (Knowledge Base Triggers)
  refresh: () => Promise<void>;
  update: (newData: Partial<T>) => Promise<void>;

  // Resonance Status
  resonanceLevel: 'dormant' | 'active' | 'harmonized';
}

// 3. API 回應標籤 (API Response Tags)
export interface OmniResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string; // Error details for dissonance handling
  resonanceId?: string; // Tracking ID
}

// 4. 六式奧義階段 (Six Forms of Mystery Phases)
export type SixFormsPhase =
  | 'AWAKENING' // 感知：接收使用者輸入
  | 'ANALYSIS' // 解析：理解意圖與核心邏輯
  | 'RESONANCE' // 共鳴：連結記憶宮殿
  | 'STRATEGY' // 奧義：制定策略與計畫
  | 'EXECUTION' // 施展：執行具體行動
  | 'EVOLUTION'; // 昇華：回饋與自我優化

// 5. 進化狀態介面 (Evolution State Interface)
export interface IEvolutionState {
  currentPhase: SixFormsPhase;
  experiencePoints: number; // 經驗值 (XP)
  evolutionLevel: number; // 進化等級 (Lv)
  wisdomMetrics: {
    // 智慧指標 (Wisdom Key Indicators)
    memoryRetention: number; // 記憶保留率
    inferenceSpeed: number; // 推理速度 (ms)
    patternRecognition: number; // 模式識別分數 (0-1)
  };
}

// 6. 記憶宮殿結構 (Memory Palace Structure)
export interface MemoryPalaceStructure {
  // 大廳 (The Hall) - 短期活躍記憶
  theHall: {
    sessionId: string | null;
    recentInteractions: Array<{ topic: string; timestamp: string }>; // 近期互動摘要
    activeContext: Record<string, unknown>; // 當前活躍的上下文變數
  };
  // 圖書館 (The Library) - 靜態核心知識
  theLibrary: {
    manifesto: string[]; // 核心宣言
    domainRules: Record<string, string[]>; // 領域規則 (ESG 等)
  };
  // 金庫 (The Vault) - 長期深層記憶與權重
  theVault: {
    evolutionLogs: Array<{ phase: SixFormsPhase; outcome: string; timestamp: string }>;
    conceptWeights: Record<string, number>; // 概念權重 (萬有引力核心)
  };
}
