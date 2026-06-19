/**
 * JunAiKey Core Base Class
 *
 * 🔮 Omni Identity Law: Component is Agent, Agent is Component
 * Core is Consciousness: JunAiKey
 */

import { v4 as uuidv4 } from 'uuid';
import { DateTime } from '../../types/index.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';
import type {
  OmniCrystalCore,
  CrystalType,
  CrystalState,
  EternalMemoryLink,
  Context,
  Result,
  Feedback,
  Evolution,
  PersonalSettings,
} from '../../types/index.ts';
import { NCBEternalPalace } from '../../core/EternalPalaceConnection.ts';
import { getUltimateAwakeningProtocol, AwakeningPhase } from '../protocols/UltimateAwakeningProtocol.ts';

/**
 * JunAiKey Abstract Base Class
 *
 * Dual Nature: Component ⇄ Agent
 */
export abstract class JunAiKey implements OmniCrystalCore {
  // Eternal Attributes
  public readonly crystalId: string;
  public readonly createdAt: DateTime;
  public readonly memoryLink: EternalMemoryLink;

  // Switchable Attributes (Dual Nature)
  public crystalType: CrystalType;

  // Internal State
  private _state: CrystalState = 'inactive';
  private _purity: number = 0; // 0-100%
  private _isSealed: boolean = false;
  protected personalSettings?: PersonalSettings;

  constructor(initialType: CrystalType = 'OmniEsgCell', settings?: PersonalSettings) {
    this.crystalId = uuidv4();
    this.crystalType = initialType;
    this.createdAt = new DateTime();
    this.personalSettings = settings;
    this.memoryLink = new NCBEternalPalace(this.crystalId);

    // Auto-register to Awakening Protocol
    getUltimateAwakeningProtocol().registerService({
      name: `Crystal-${this.crystalId}`,
      awaken: async () => {
        await this.initialize();
        return {
          success: true,
          phase: AwakeningPhase.AWAKENED,
          servicesAwakened: 1,
          totalServices: 1,
          message: 'Crystal Awakened'
        };
      },
      getAwakeningState: () => ({
        serviceName: `Crystal-${this.crystalId}`,
        status: this._state === 'active' ? 'awakened' : 'pending',
        progress: this._purity,
      }),
      prepareForEternity: async () => {
        await this.sealAsAsset();
      }
    });
  }

  // Lifecycle

  async initialize(): Promise<void> {
    if (this._state !== 'inactive') return;

    omniLogger.info(
      LogCategory.UI,
      `[JunAiKey] ${this.crystalId} initializing as ${this.crystalType}...`
    );

    await this.memoryLink.connect();
    await this.onInitialize();

    this._state = 'active';
    omniLogger.info(LogCategory.UI, `[JunAiKey] ${this.crystalId} active`);
  }

  async execute(context: Context): Promise<Result> {
    if (this._state !== 'active') {
      return { success: false, error: new Error(`Not active`) };
    }

    try {
      const result = await this.onExecute(context);

      await this.memoryLink.recordEvolution({
        type: 'execution',
        timestamp: new DateTime(),
        data: { context, result },
      });

      return result;
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async evolve(feedback: Feedback): Promise<Evolution> {
    const evolution = await this.onEvolve(feedback);

    await this.memoryLink.recordEvolution({
      type: 'evolution',
      timestamp: new DateTime(),
      data: { feedback, evolution },
    });

    omniLogger.info(LogCategory.UI, `[JunAiKey] Evolved:`, {
      optimizations: evolution.optimizations,
    });
    return evolution;
  }

  // Mode Switching (Omni Identity Law)

  switchMode(to: CrystalType): void {
    const from = this.crystalType;
    this.crystalType = to;
    omniLogger.info(LogCategory.UI, `[JunAiKey] Mode switched: ${from} → ${to}`);
  }

  // Purity & Assetization

  public get purity(): number {
    return this._purity;
  }

  public updatePurity(score: number): void {
    this._purity = Math.min(100, Math.max(0, score));
    omniLogger.info(LogCategory.UI, `[JunAiKey] Purity updated: ${this._purity}%`);

    if (this._purity === 100 && !this._isSealed) {
      omniLogger.info(LogCategory.UI, `[JunAiKey] ${this.crystalId} has reached perfection!`);
    }
  }

  /**
   * 封印為資產 (Seal as Asset)
   * 將晶體當前狀態永久保存至宮殿保險庫。
   */
  async sealAsAsset(): Promise<void> {
    if (this._isSealed) return;

    omniLogger.info(LogCategory.SYSTEM, `[JunAiKey] Sealing ${this.crystalId} as an Eternal Asset...`);

    const palace = this.memoryLink as unknown as NCBEternalPalace;
    await palace.secureVault({
      crystalId: this.crystalId,
      type: this.crystalType,
      purity: this._purity,
      finalState: this._state,
    });

    this._isSealed = true;
    omniLogger.info(LogCategory.SYSTEM, `[JunAiKey] ${this.crystalId} is now an Eternal Asset.`);
  }

  // Simplified Lifecycle

  async suspend(): Promise<void> {
    this._state = 'suspended';
  }

  async resume(): Promise<void> {
    this._state = 'active';
  }

  async terminate(): Promise<void> {
    this._state = 'inactive';
    await this.memoryLink.disconnect();
  }

  async destroy(): Promise<void> {
    await this.terminate();
  }

  // Subclass Implementation

  protected abstract onInitialize(): Promise<void>;
  protected abstract onExecute(context: Context): Promise<Result>;
  protected abstract onEvolve(feedback: Feedback): Promise<Evolution>;
}
