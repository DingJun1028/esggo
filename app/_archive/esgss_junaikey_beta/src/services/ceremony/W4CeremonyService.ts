/**
 * @esgss/jun-ai-ceremony
 * W4CeremonyService（W4 聖典刻印服務）
 * 
 * 實現 W4 聖典的最終刻印與 Hash Lock 執行
 * 遵循 W4 聖典執行手冊規範
 */


import {
  IComponentCore,
  ISealedData,
  ComponentCoreFactory,
  generateOmniUUID,
  computeHash,
  createSealedObject
} from './core/IComponentCore.js';
import { AlchemyForge, ResonanceResult } from './core/AlchemyForge.js';
import {
  IT5TProtocol,
  T5TProtocolFactory,
  T5TComplianceResult
} from './types/T5TProtocol.js';
import {
  T5TValidator,
  createT5TValidator,
  T5TValidationDetail
} from './T5TValidator.js';

/**
 * W4 刻印配置
 */
export interface W4CeremonyConfig {
  /** 聖典名稱 */
  name: string;
  /** 參與者列表 */
  allianceMembers?: string[];
  /** 是否需要共鳴驗證 */
  requireResonanceVerification?: boolean;
  /** 最小 Rs 閾值 */
  minRsThreshold?: number;
  /** 自定義證據 */
  customEvidence?: string[];
}

/**
 * 支柱共鳴詳細結果
 */
export interface PillarResonanceDetail {
  pillar: string;
  result: ResonanceResult;
}

/**
 * W4 刻印結果
 */
export interface IW4CeremonyResult {
  /** 聖典 UUID */
  readonly scripture_uuid: string;
  /** 聯盟成員 */
  readonly alliance_members: string[];
  /** 總 Rs 分數 */
  readonly total_rs: number;
  /** Hash Lock 簽章 */
  readonly hash_lock: string;
  /** 刻印時間 */
  readonly sealed_at: string;
  /** 5T 合規評估 */
  readonly t5t_compliance: T5TComplianceResult;
  /** 共鳴詳細結果 */
  readonly resonance_details: PillarResonanceDetail[];
}

/**
 * 四大支柱數據
 */
export interface FourPillarsData {
  /** 第一支柱: Tangible (可觸知) */
  tangible: Record<string, unknown>;
  /** 第二支柱: Traceable (可追溯) */
  traceable: Record<string, unknown>;
  /** 第三支柱: Trackable (可追蹤) */
  trackable: Record<string, unknown>;
  /** 第四支柱: Trustworthy (可信賴) */
  trustworthy: Record<string, unknown>;
}

/**
 * 刻印階段狀態
 */
export enum CeremonyPhase {
  /** 準備階段 */
  PREPARING = 'preparing',
  /** 共鳴驗證階段 */
  RESONANCE_VERIFICATION = 'resonance_verification',
  /** 5T 評估階段 */
  T5T_EVALUATION = 't5t_evaluation',
  /** 刻印階段 */
  SEALING = 'sealing',
  /** 完成階段 */
  COMPLETED = 'completed',
  /** 失敗階段 */
  FAILED = 'failed'
}

/**
 * 刻印進度更新回調
 */
export interface CeremonyProgressCallback {
  (phase: CeremonyPhase, progress: number, message: string): void;
}

/**
 * W4CeremonyService - W4 聖典刻印服務
 * 
 * 功能：
 * 1. executeCeremony() - 執行完整刻印儀式
 * 2. verifyPillars() - 驗證四大支柱
 * 3. sealWithHashLock() - 執行 Hash Lock 刻印
 * 4. generateCertificate() - 生成刻印證書
 * 5. verifySeal() - 驗證刻印完整性
 */
export class W4CeremonyService {
  private config: Required<W4CeremonyConfig>;
  private validator: T5TValidator;
  private alchemyForge: AlchemyForge;
  private currentPhase: CeremonyPhase = CeremonyPhase.PREPARING;

  constructor(config: W4CeremonyConfig) {
    this.config = {
      name: config.name,
      allianceMembers: config.allianceMembers ?? [],
      requireResonanceVerification: config.requireResonanceVerification ?? true,
      minRsThreshold: config.minRsThreshold ?? 50,
      customEvidence: config.customEvidence ?? []
    };
    this.validator = createT5TValidator();
    this.alchemyForge = new AlchemyForge({
      min_rs_threshold: this.config.minRsThreshold,
      enable_purification: true
    });
  }

  /**
   * 執行完整的 W4 刻印儀式
   */
  async executeCeremony(
    pillars: FourPillarsData,
    onProgress?: CeremonyProgressCallback
  ): Promise<IW4CeremonyResult> {
    const startTime = Date.now();

    try {
      // 階段 1: 準備
      this.currentPhase = CeremonyPhase.PREPARING;
      onProgress?.(this.currentPhase, 10, 'Initializing ceremony...');

      // 生成聖典 UUID
      const scriptureUuid = generateOmniUUID(`W4-${this.config.name}`, startTime);

      // 階段 2: 共鳴驗證
      this.currentPhase = CeremonyPhase.RESONANCE_VERIFICATION;
      onProgress?.(this.currentPhase, 30, 'Calculating pillar resonance, please wait...');

      const resonanceDetails = this.calculatePillarResonances(pillars);

      // 驗證共鳴閾值
      if (this.config.requireResonanceVerification) {
        const minResonance = Math.min(...resonanceDetails.map(r => r.result.rs_score));
        if (minResonance < this.config.minRsThreshold) {
          throw new Error(`共鳴分數 ${minResonance} 低於最低閾值 ${this.config.minRsThreshold}`);
        }
      }

      // 階段 3: 5T 評估
      this.currentPhase = CeremonyPhase.T5T_EVALUATION;
      onProgress?.(this.currentPhase, 60, 'Evaluating 5T protocol compliance...');

      // 創建並評估 5T 協議
      const t5tProtocol = this.createPillarProtocol(pillars);
      const t5tCompliance = this.validator.calculateOverallCompliance(t5tProtocol);

      // 驗證合規
      if (t5tCompliance.compliance_status === 'non_compliant') {
        throw new Error('5T 協議合規評估未通過');
      }

      // 階段 4: 刻印
      this.currentPhase = CeremonyPhase.SEALING;
      onProgress?.(this.currentPhase, 85, 'Executing Hash Lock sealing...');

      // 計算總 Rs 分數
      const totalRs = Math.round(
        resonanceDetails.reduce((sum, r) => sum + r.result.rs_score, 0) / resonanceDetails.length
      );

      // 創建密封數據
      const sealData = {
        scripture_uuid: scriptureUuid,
        name: this.config.name,
        pillars,
        alliance_members: this.config.allianceMembers,
        total_rs: totalRs,
        sealed_at: new Date().toISOString(),
        resonance_details: resonanceDetails,
        t5t_compliance: t5tCompliance
      };

      const sealedData = this.alchemyForge.seal(sealData, `W4-${this.config.name}`);

      // 階段 5: 完成
      this.currentPhase = CeremonyPhase.COMPLETED;
      onProgress?.(this.currentPhase, 100, 'Ceremony completed successfully!');

      return {
        scripture_uuid: scriptureUuid,
        alliance_members: this.config.allianceMembers,
        total_rs: totalRs,
        hash_lock: sealedData.hash_lock,
        sealed_at: new Date().toISOString(),
        t5t_compliance: t5tCompliance,
        resonance_details: resonanceDetails
      };

    } catch (error) {
      this.currentPhase = CeremonyPhase.FAILED;
      onProgress?.(this.currentPhase, 0, `Ceremony Failed: ${error instanceof Error ? error.message : 'Unknown Error'}`);

      throw error;
    }
  }

  /**
   * 計算四大支柱的 Rs 共鳴值
   */
  private calculatePillarResonances(pillars: FourPillarsData): PillarResonanceDetail[] {
    return [
      { pillar: 'Tangible', result: this.alchemyForge.calculateResonance(pillars.tangible, 'W4-Tangible') },
      { pillar: 'Traceable', result: this.alchemyForge.calculateResonance(pillars.traceable, 'W4-Traceable') },
      { pillar: 'Trackable', result: this.alchemyForge.calculateResonance(pillars.trackable, 'W4-Trackable') },
      { pillar: 'Trustworthy', result: this.alchemyForge.calculateResonance(pillars.trustworthy, 'W4-Trustworthy') }
    ];
  }

  /**
   * 為四大支柱創建 5T 協議
   */
  private createPillarProtocol(pillars: FourPillarsData): IT5TProtocol {
    return T5TProtocolFactory.create(
      `W4-${this.config.name}`,
      this.config.allianceMembers.join(',') || 'system'
    );
  }

  /**
   * 僅執行 Hash Lock 刻印（快速模式）
   */
  sealWithHashLock(
    data: Record<string, unknown>,
    sourceOrigin: string
  ): ISealedData {
    return this.alchemyForge.seal(data, sourceOrigin);
  }

  /**
   * 驗證 5T 支柱
   */
  verifyPillars(pillars: FourPillarsData): T5TValidationDetail {
    const protocol = this.createPillarProtocol(pillars);
    return this.validator.validateProtocol(protocol);
  }

  /**
   * 驗證刻印完整性
   */
  verifySeal(sealedData: ISealedData, originalData: Record<string, unknown>): boolean {
    return this.alchemyForge.verifySeal(sealedData);
  }

  /**
   * 生成 W4 刻印證書
   */
  generateCertificate(result: IW4CeremonyResult): string {
    const certificate = {
      certificate_id: generateOmniUUID('CERTIFICATE', Date.now()),
      scripture_uuid: result.scripture_uuid,
      ceremony_name: this.config.name,
      alliance_members: result.alliance_members,
      total_rs: result.total_rs,
      hash_lock: result.hash_lock,
      sealed_at: result.sealed_at,
      compliance_status: result.t5t_compliance.compliance_status,
      compliance_score: result.t5t_compliance.overall_score,
      generated_at: new Date().toISOString(),
      signature: computeHash(JSON.stringify({
        scripture_uuid: result.scripture_uuid,
        hash_lock: result.hash_lock,
        sealed_at: result.sealed_at
      }))
    };

    return JSON.stringify(certificate, null, 2);
  }

  /**
   * 獲取當前刻印階段
   */
  getCurrentPhase(): CeremonyPhase {
    return this.currentPhase;
  }

  /**
   * 創建 W4 刻印的快捷方法
   */
  static async seal(
    pillars: FourPillarsData,
    name: string,
    allianceMembers?: string[]
  ): Promise<IW4CeremonyResult> {
    const service = new W4CeremonyService({
      name,
      allianceMembers
    });

    return service.executeCeremony(pillars);
  }
}

/**
 * 四大支柱數據工廠
 */
export class FourPillarsFactory {
  /**
   * 創建空白的四大支柱數據
   */
  static createEmpty(): FourPillarsData {
    const timestamp = Date.now();

    return {
      tangible: {
        uuid: generateOmniUUID('Tangible', timestamp),
        version: '1.0.0',
        timestamp,
        verified: false,
        verification_method: '',
        fingerprint: ''
      },
      traceable: {
        uuid: generateOmniUUID('Traceable', timestamp),
        version: '1.0.0',
        timestamp,
        created_at: timestamp,
        created_by: '',
        modification_history: [],
        origin_source: ''
      },
      trackable: {
        uuid: generateOmniUUID('Trackable', timestamp),
        version: '1.0.0',
        timestamp,
        tracking_id: `TRACK-${timestamp}`,
        current_state: 'active',
        state_history: [],
        metrics: {
          activity_level: 1.0,
          usage_frequency: 0,
          last_activity_at: timestamp
        }
      },
      trustworthy: {
        uuid: generateOmniUUID('Trustworthy', timestamp),
        version: '1.0.0',
        timestamp,
        trust_score: 50,
        trust_level: 'medium',
        trust_history: [],
        certifications: []
      }
    };
  }

  /**
   * 從組件創建四大支柱數據
   */
  static fromComponents(components: {
    tangible?: Record<string, unknown>;
    traceable?: Record<string, unknown>;
    trackable?: Record<string, unknown>;
    trustworthy?: Record<string, unknown>;
  }): FourPillarsData {
    return {
      tangible: components.tangible ?? this.createEmpty().tangible,
      traceable: components.traceable ?? this.createEmpty().traceable,
      trackable: components.trackable ?? this.createEmpty().trackable,
      trustworthy: components.trustworthy ?? this.createEmpty().trustworthy
    };
  }
}

/**
 * 創建 W4CeremonyService 實例的工廠函數
 */
export function createW4CeremonyService(config: W4CeremonyConfig): W4CeremonyService {
  return new W4CeremonyService(config);
}
