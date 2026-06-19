/**
 * 🏛️ OmniCoreIntegrity (數據溯源與 Hash 封印模組)
 * v2.1 | #ModularSingularity #EnglishStandardized #BidirectionalTS
 * 
 * 遵循「英標繁博」與「奧義六式執行框架」。
 */

import { sha256, generateNonce } from '../crypto-proof';
import { IComponentCore, IEvidence } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * IntegrityModule: 數據誠信的核心守護者
 * 負責數據的「本質提純」、「熵減煉金」與「永恆刻印」。
 */
export class IntegrityModule {
  
  /**
   * 第一式：本質提純 (extractQuantumEssence)
   * 從原始輸入中提取核心 5T 維度，過濾噪音。
   */
  public extractQuantumEssence(data: any): Partial<IEvidence> {
    console.log(`[本質提純] 正在從數據源中提取 5T 維度...`);
    return {
      tangible_metric: data.metric || data.impact_metric || 'Unknown',
      source_origin: data.source || data.source_origin || '/unknown',
      formula_ref: data.formula || data.formula_ref || 'Direct measurement',
      lifecycle_hooks: data.hooks || data.lifecycle_hooks || []
    };
  }

  /**
   * 第五式：熵減煉金 (purify)
   * 對數據進行標準化與格式化，消除冗餘與混亂。
   */
  public purify(essence: Partial<IEvidence>): IEvidence {
    console.log(`[熵減煉金] 執行數據精煉與格式標準化...`);
    return {
      tangible_metric: String(essence.tangible_metric).trim(),
      source_origin: essence.source_origin?.startsWith('/') ? essence.source_origin : `/${essence.source_origin}`,
      formula_ref: essence.formula_ref || 'GRI-STANDARD-DEFAULT',
      lifecycle_hooks: [...(essence.lifecycle_hooks || []), `purified_at_${Date.now()}`]
    };
  }

  /**
   * 第六式：永恆刻印 (engrave)
   * 執行 T4 Hash Lock，將數據狀態結晶化為不可篡改的「信」。
   */
  public async engrave(
    purifiedEvidence: IEvidence,
    version = '2.1.0'
  ): Promise<IComponentCore> {
    const uuid = uuidv4();
    const timestamp = Date.now();
    
    console.log(`[永恆刻印] 正在為組件 ${uuid} 注入雜湊鎖定...`);

    // 構建真理載體 (Truth Carrier)
    const payload = JSON.stringify({
      uuid,
      version,
      timestamp,
      formula: purifiedEvidence.formula_ref,
      impact_metric: purifiedEvidence.tangible_metric,
      evidence: [purifiedEvidence],
    });

    const hashLock = await sha256(payload);

    // 數據結晶化 (Crystallization)
    const crystal: IComponentCore = Object.freeze({
      uuid,
      version,
      timestamp,
      formula: purifiedEvidence.formula_ref,
      impact_metric: purifiedEvidence.tangible_metric,
      status: 'Trustworthy' as const,
      hash_lock: hashLock,
      evidence: [purifiedEvidence]
    });

    console.log(`[刻印成功] 組件已轉化為不可篡改狀態。Hash: ${hashLock.substring(0, 16)}...`);
    return crystal;
  }

  /**
   * 萬能封印 (Sacred Seal)
   * 封裝完整的六式流程，從需求到結晶。
   */
  public async sacredSeal(rawData: any): Promise<IComponentCore> {
    const essence = this.extractQuantumEssence(rawData);
    const purified = this.purify(essence);
    return await this.engrave(purified);
  }

  /**
   * 真理校驗 (Verify Truth)
   * 驗證現有晶體是否遭受熵增（篡改）污染。
   */
  public async verify(crystal: IComponentCore): Promise<boolean> {
    const payload = JSON.stringify({
      uuid: crystal.uuid,
      version: crystal.version,
      timestamp: crystal.timestamp,
      formula: crystal.formula,
      impact_metric: crystal.impact_metric,
      evidence: crystal.evidence,
    });

    const computedHash = await sha256(payload);
    const isValid = computedHash === crystal.hash_lock;

    if (isValid) {
      console.log(`[校驗通過] 晶體誠信完整，真理錨點無偏移。`);
    } else {
      console.error(`[校驗失敗] 偵測到數據偏差！雜湊不匹配。`);
    }

    return isValid;
  }
}

export const integrityModule = new IntegrityModule();
