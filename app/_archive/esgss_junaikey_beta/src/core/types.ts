export type TemporalEventType =
  | 'ENTROPY_HEAL' // 過去：免疫系統修復記錄 (Amber)
  | 'AUTOMATION' // 過去：自動化執行記錄 (Purple)
  | 'TASK_DUE' // 未來：筆記中的待辦事項 (Emerald)
  | 'PREDICTION' // 未來：AI 預測的風險日 (Red)
  | 'EXTERNAL_GOOGLE' // 外部：Google 日曆
  | 'EXTERNAL_APPLE'; // 外部：Apple 日曆

export interface TemporalEvent {
  id: string;
  date: string; // YYYY-MM-DD
  type: TemporalEventType;
  title: string;
  intensity: number; // 1-10 (用於決定光暈強度)
  contextId?: string; // 關聯的 OmniEsgCell ID
}

export type EntropyLevel = 'ZERO' | 'HIGH' | 'CRITICAL';
export type HealingStrategy = 'PASS_THROUGH' | 'GAP_FILLING' | 'ROLLBACK';

export interface PurifiedArtifact<T> {
  data: T;
  originalData: T;
  entropy: EntropyLevel;
  strategyUsed: HealingStrategy;
  witnessSignature: string;
}

export type TaskPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'WAITING' | 'DONE';

export interface OmniTask {
  id: string;
  title: string;
  description?: string;

  // 🔗 奧秘連結 (Omni Links)
  contextId?: string; // 關聯的 ESG 指標 (例如 "Carbon-Scope-1")
  sourceNoteId?: string; // 來自哪則奧秘筆記

  // ⏳ 時空屬性
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm

  // 🧠 智慧屬性
  priority: TaskPriority;
  aiSuggested?: boolean; // 是否由 AI 自動生成
  automationId?: string; // 關聯的 Make/Boost.space Webhook

  // 🌲 結構屬性
  subTasks: OmniTask[]; // 任務裂變
  tags: string[];
  status: TaskStatus;
}
