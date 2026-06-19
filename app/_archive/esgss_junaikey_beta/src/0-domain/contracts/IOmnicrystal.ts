/**
 * 🏛️ 奧秘晶體核心契約 (IOmnicrystal)
 * --------------------------------------------------
 * [系列] 奧秘元件核心心核 (Omni Component Core Heart)
 * [功能] 定義「心核」的運算、演化與執行規範。
 */

import { UUID } from '../contracts/Omni-component-core.types';

export interface CrystalContext {
  id: UUID;
  input: any;
  timestamp: number;
}

export interface CrystalResult {
  success: boolean;
  output: any;
  error?: Error;
}

export interface IOmnicrystal {
  readonly crystalId: UUID;
  readonly crystalType: string;

  initialize(): Promise<void>;
  execute(context: CrystalContext): Promise<CrystalResult>;
  evolve(feedback: any): Promise<any>;
  destroy(): Promise<void>;
}
