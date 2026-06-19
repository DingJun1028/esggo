// src/core/time/types.ts

export type TemporalEventType =
  | 'ENTROPY_HEAL' // Past: Immune System Log (Amber)
  | 'AUTOMATION' // Past: Automation Log (Purple)
  | 'TASK_DUE' // Future: System Task (Emerald)
  | 'EXTERNAL_GOOGLE' // Future: Google Calendar (Blue)
  | 'EXTERNAL_APPLE' // Future: Apple Calendar (Gray)
  | 'PREDICTION'; // Future: AI Risk Prediction (Red)

export interface TemporalEvent {
  id: string;
  date: string; // YYYY-MM-DD
  type: TemporalEventType;
  title: string;
  intensity: number; // 1-10 (For visual glow intensity)
  contextId?: string; // Linked OmniEsgCell ID
}
