/**
 * 🌟 Omni Crystal Types
 * --------------------------------------------------
 * [核心] 奧秘晶體的型別定義
 * [功能] 狀態、模式、工具、訊息介面
 */

// 晶體狀態
export enum CrystalState {
  IDLE = 'idle',
  THINKING = 'thinking',
  EXECUTING = 'executing',
  ERROR = 'error',
  COMPLETE = 'complete',
  HYPER = 'hyper',
}

// 互動模式
export enum InteractionMode {
  TOOL_MENU = 'tool_menu',
  AI_CHAT = 'ai_chat',
  QUICK_SKILLS = 'quick_skills',
  CLOSED = 'closed',
}

// 工具定義
export interface OmniTool {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  skillId: string;
  description: string;
  descriptionEn: string;
}

// 晶體組件 Props
export interface OmniCrystalProps {
  onToolSelect: (toolId: string) => void;
  onQuestionSubmit: (question: string) => void;
  initialState?: CrystalState;
  language?: 'zh-TW' | 'en';
}

import { StructuredResponse } from './StructuredResponse';

// 對話訊息
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  skillExecuted?: string;
  structuredResponse?: StructuredResponse;
}

// AI 回應
export interface AIResponse {
  message: string;
  intent?: string;
  skillToExecute?: string;
  confidence: number;
}
