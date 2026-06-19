/**
 * 💡 奧秘組件心核：奧秘識別碼生成器 (OmniUUIDGenerator)
 * --------------------------------------------------
 * [協議] 🟢 可溯源 (Traceable)
 *
 * 核心職責：
 * 1. 為系統內的所有實體分發唯一標識 (UUID v4)。
 * 2. 支援語義化前綴，提升日誌與數據鏈的可讀性。
 */

export enum OmniEntityPrefix {
  DATA = 'DA', // 數據實體
  DATAPOINT = 'DP', // 數據點
  SERVICE = 'SV', // 服務節點
  EVIDENCE = 'EV', // 證據憑證
  LEGION = 'LG', // 軍團
  AVATAR = 'AV', // 化身
  MISSION = 'MS', // 任務
  RITUAL = 'RI', // 儀式
  REPORT = 'RP', // 報告
  CRYSTAL = 'CR', // 晶體
  CERT = 'CT', // 證書
  TRANSACTION = 'TX', // 交易
  SENTIENCE = 'SN', // 靈知
  SKILL = 'SK', // 奧義
}

export class OmniUUIDGenerator {
  /**
   * 生成帶前綴的 UUID
   * 格式: PREFIX-UUID
   */
  static generate(prefix: OmniEntityPrefix): string {
    const uuid = this.v4();
    return `${prefix}-${uuid}`;
  }

  /**
   * 標準 UUID v4 生成器
   */
  private static v4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * 驗證格式是否正確
   */
  static validate(id: string, prefix?: OmniEntityPrefix): boolean {
    const parts = id.split('-');
    if (parts.length < 2) return false;

    if (prefix && parts[0] !== prefix) return false;

    // 簡單的 UUID 格式檢查
    const uuidPart = parts.slice(1).join('-');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuidPart);
  }
}
