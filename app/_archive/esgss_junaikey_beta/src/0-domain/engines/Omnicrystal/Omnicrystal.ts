/**
 * 🏛️ 奧秘晶體基礎類別 (Omnicrystal)
 * --------------------------------------------------
 * [系列] 奧秘心核 (Omni Heart)
 * [背景] 此為所有「心核」組件的靈魂基石。
 */

import { IOmnicrystal, CrystalContext, CrystalResult } from '../../contracts/IOmnicrystal';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

export abstract class Omnicrystal implements IOmnicrystal {
  readonly crystalId: string;
  readonly crystalType: string;
  protected memoryLink: any; // Using any to avoid circular deps for now, implies EternalMemory capability

  constructor(type: string) {
    this.crystalId = 'CRYSTAL-' + Math.random().toString(36).substr(2, 9);
    this.crystalType = type;
    this.memoryLink = {
      query: async (params: any) => ({ success: true, data: {} }), // Mock implementation
    };
  }

  protected switchMode(mode: string): void {
    omniLogger.info(LogCategory.SYSTEM, `Crystal [${this.crystalId}] switching to mode: ${mode}`);
    // Implementation logic would go here
  }

  async initialize(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, `Initializing Omnicrystal Heart [${this.crystalType}]`);
    await this.onInitialize();
  }

  async execute(context: CrystalContext): Promise<CrystalResult> {
    omniLogger.info(LogCategory.SYSTEM, `Executing Crystal Logic: ${this.crystalId}`);
    return this.onExecute(context);
  }

  async evolve(feedback: any): Promise<any> {
    omniLogger.info(LogCategory.SYSTEM, `Evolving Crystal: ${this.crystalId}`);
    return this.onEvolve(feedback);
  }

  async destroy(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, `Crystallization Terminated: ${this.crystalId}`);
  }

  protected abstract onInitialize(): Promise<void>;
  protected abstract onExecute(context: CrystalContext): Promise<CrystalResult>;
  protected abstract onEvolve(feedback: any): Promise<any>;
}
