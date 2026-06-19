/**
 * @esgss/jun-ai-ceremony
 * IComponentCore 規範 - 所有組件必須具備的統一識別機制
 * 
 * 遵循 W4 聖典執行手冊規範
 * Tangible, Traceable, Trackable, Transparent, Trustworthy (5T Protocol)
 */

import CryptoJS from 'crypto-js';

/**
 * IComponentCore 介面 - 所有組件的核心識別規範
 * 所有組件必須具備 uuid, version, timestamp, source_origin, evidence
 */
export interface IComponentCore {
  /** 統一識別碼 - InfoOne = OmniESGcell = Omnicell */
  readonly uuid: string;
  /** 版本號 - 遵循語意化版本控制 */
  readonly version: string;
  /** 時間戳記 - ISO 8601 UTC 格式 */
  readonly timestamp: number;
  /** 來源Origin - 組件的原始出處 */
  readonly source_origin: string;
  /** 證據鏈 - 用於追溯 and 驗證 */
  evidence: string[];
}

/**
 * ISealedData 介面 - 經過 Hash Lock 的密封數據
 */
export interface ISealedData extends IComponentCore {
  /** Rs 共鳴分數 - 靈魂共鳴值 */
  readonly rs_score: number;
  /** SBT 等級 - 靈魂綁定代幣等級 */
  readonly sbt_tier: 'Coal' | 'Seed' | 'Pulse';
  /** Hash Lock - Object.freeze() 不可篡改機制 */
  readonly hash_lock: string;
}

/**
 * 元件元數據工廠
 */
export class ComponentCoreFactory {
  /**
   * 生成標準化的 IComponentCore
   */
  static create(
    source_origin: string,
    version: string = '1.0.0',
    evidence: string[] = []
  ): IComponentCore {
    const timestamp = Date.now();
    const uuid = generateOmniUUID(source_origin, timestamp);

    return {
      uuid,
      version,
      timestamp,
      source_origin,
      evidence: [...evidence, `Created at ${new Date(timestamp).toISOString()}`]
    };
  }

  /**
   * 創建密封數據 (ISealedData)
   */
  static createSealed(
    source_origin: string,
    data: Record<string, unknown>,
    rs_score: number,
    sbt_tier: 'Coal' | 'Seed' | 'Pulse'
  ): ISealedData {
    const core = this.create(source_origin);
    const dataString = JSON.stringify(data);
    const hash_lock = computeHash(dataString);

    return {
      ...core,
      rs_score,
      sbt_tier,
      hash_lock
    };
  }
}

/**
 * 生成 OmniESGcell UUID 格式
 * 格式: ARIA-CORP-[UNIQUE_HASH]-[TIMESTAMP_HASH]
 */
export function generateOmniUUID(source_origin: string, timestamp?: number): string {
  const ts = timestamp || Date.now();
  const randomBytes = CryptoJS.lib.WordArray.random(16).toString();
  const sourceHash = CryptoJS.SHA256(source_origin).toString().substring(0, 8);
  const tsHash = CryptoJS.SHA256(ts.toString()).toString().substring(0, 8);

  return `ARIA-CORP-${sourceHash}-${tsHash}-${randomBytes.substring(0, 12)}`;
}

/**
 * 計算資料的 Hash 值
 */
export function computeHash(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

/**
 * 驗證 Hash Lock 是否有效
 */
export function verifyHashLock(data: Record<string, unknown>, expectedHash: string): boolean {
  const dataString = JSON.stringify(data);
  const computedHash = computeHash(dataString);
  return computedHash === expectedHash;
}

/**
 * 創建不可篡改的密封對象 (使用 Object.freeze)
 */
export function createSealedObject<T extends Record<string, unknown>>(
  data: T,
  core: ISealedData
): Readonly<T> & ISealedData {
  const sealed = Object.freeze({
    ...data,
    uuid: core.uuid,
    version: core.version,
    timestamp: core.timestamp,
    source_origin: core.source_origin,
    evidence: Object.freeze([...core.evidence]),
    rs_score: core.rs_score,
    sbt_tier: core.sbt_tier,
    hash_lock: core.hash_lock
  }) as Readonly<T> & ISealedData;

  return sealed;
}
