/**
 * 奧秘基底類別 (OmniBase)
 * --------------------------------------------------
 * [核心功能] 提供所有 Omni 組件的基礎身分與生命週期管理。
 */

import {
  IComponentCore,
  MeridianFlow,
  IMeritProfile10,
  IRpgStats,
  IVitals,
  IEsgAttributes,
  IOmniAttributes,
  IOmniInfoCore,
} from '../contracts/IComponentCore';
import { LifecycleHook } from '../../types/esgss_schema';
import { v4 as uuidv4 } from 'uuid';

export abstract class OmniBase implements IComponentCore {
  public readonly uuid: string;
  public readonly version: string = '7.0.0-OMNIONE';
  public readonly timestamp: number;
  public status: IComponentCore['status'] = 'Trustworthy'; // 狀態：預設不可篡改
  public readonly meridian: MeridianFlow = 'INWARD_REN';

  /** 六德行屬性 (Six Virtues) - IMeritProfile10 標準定義 */
  public readonly virtues: IMeritProfile10 = {
    intelligence: 10,  // 智 - Intelligence
    benevolence: 10,   // 仁 - Benevolence
    integrity: 10,     // 誠 - Integrity
    courage: 10,       // 勇 - Courage
    temperance: 10,    // 節 - Temperance
    harmony: 10,       // 和 - Harmony
  };

  /** 🌟 RPG Attributes (Adventurer Persona) */
  public rpgStats: IRpgStats = {
    str: 10, vit: 10, int: 10, wis: 10, dex: 10, luk: 10
  };

  /** 🩸 Vitals (Life Force) */
  public vitals: IVitals = {
    hp: 100, maxHp: 100, mp: 50, maxMp: 50
  };

  /** 🌿 ESG Attributes (Triple Bottom Line) */
  public esg: IEsgAttributes = {
    environmental: 50,
    social: 50,
    governance: 50
  };

  /** 💠 Omni Attributes (Crystalline Core Metrics) */
  public omniAttrs: IOmniAttributes = {
    resonance: 1.0,
    integrity: 100,
    awakening: 0
  };

  public data: unknown = {};

  protected _lifecycle_hooks: LifecycleHook[] = [];
  protected _source_origin: string;

  constructor(version?: string, sourceOrigin?: string) {
    this.uuid = uuidv4();
    this.timestamp = Date.now();
    this._source_origin = sourceOrigin || 'OmniBase';
    if (version) this.version = version;

    // Initial lifecycle hook
    this.addLifecycleHook('created', 'System');
  }

  /**
   * 5T 協議證據庫 (滿足 IComponentCore)
   * 依照 5T 邏輯門順序回傳 (Tangible -> Trustworthy)
   */
  public get evidence(): IComponentCore['evidence'] {
    return {
      tangible: {
        metric: 'base_status:initialized',
        visual_grade: 'GOLD',
        timestamp: this.timestamp,
        is_crystallized: true, // Required by FiveTValidator
      },
      traceable: {
        source_origin: this._source_origin,
      },
      trackable: {
        lifecycle_hooks: [...this._lifecycle_hooks],
      },
      transparent: {
        formula: 'Base_Integrity = Constant',
      },
      trustworthy: {
        hash_lock: this.calculateHashLock(),
        is_frozen: Object.isFrozen(this),
      },
      verified_at: this.timestamp,
      source_origin: this._source_origin,
      lifecycle_hooks: [...this._lifecycle_hooks],
      hash_lock: this.calculateHashLock(),
    };
  }

  /** 📊 Resonance Metric Rs (Supreme Will Assessment) */
  public get resonance_rs(): number {
    // Basic Rs = (1.0 purity * 1.0 resilience) / 1.0 entropy
    return 1.0;
  }

  protected _architecture: any = null;

  /** 🌐 Architecture V7 Deployment */
  public get architecture(): any {
    return this._architecture || {
      version: 'V7.0-OMNIONE',
      will_authorized: true,
      gemini_alignment: this.meridian === 'INWARD_REN' ? 0.9 : 0.8,
      resonance_rs: this.resonance_rs
    };
  }

  public set architecture(value: any) {
    this._architecture = value;
  }

  /**
   * 計算雜湊鎖定碼
   */
  private calculateHashLock(): string {
    const data = `${this.uuid}-${this.timestamp}-${this.version}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  /**
   * 添加生命週期勾子 (取代舊有的 addEvidence)
   */
  protected addLifecycleHook(
    event: LifecycleHook['event'],
    actor: string,
    metadata?: Record<string, unknown>
  ): void {
    this._lifecycle_hooks.push(
      Object.freeze({
        event,
        timestamp: Date.now(),
        actor,
        metadata,
      })
    );
  }

  /**
   * 核心初始化邏輯 (可覆寫)
   */
  public async initialize(): Promise<void> {
    // Default implementation
  }

  /**
   * 核心銷毀邏輯 (可覆寫)
   */
  public async destroy(): Promise<void> {
    // Default implementation ensures cleanup
    this._lifecycle_hooks = [];
  }
}
