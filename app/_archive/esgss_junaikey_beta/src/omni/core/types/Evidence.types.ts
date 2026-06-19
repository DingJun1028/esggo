import { Protocol5T } from './InfoOne.types';

/**
 * 📂 證據資產類型 / Evidence Asset Types
 */
export type EvidenceType = 'invoice' | 'bill' | 'photo' | 'screenshot' | 'document' | 'other';

/**
 * ✍️ 電子簽章結構 / Digital Signature Structure
 */
export interface IDigitalSignature {
    readonly signerId: string;      // 簽署人 ID
    readonly signerName: string;    // 簽署人姓名
    readonly signature: string;     // 數位簽章 (Hash/Private Key Signature)
    readonly timestamp: number;     // 簽署時間戳
    readonly hashAlgorithm: 'SHA-256' | 'ED25519';
}

/**
 * 🔒 證據資產 / Evidence Asset
 */
export interface IEvidenceAsset {
    readonly id: string;            // 證據唯一標識
    readonly type: EvidenceType;    // 證據類型
    readonly fileUrl: string;       // 檔案路徑或原始單據連結 [Traceable]
    readonly screenshotUrl?: string;// 當日輸入截圖 [Traceable]
    readonly hash: string;          // 檔案原始雜湊 [Trustworthy]
    readonly metadata: Record<string, unknown>;
}

/**
 * 🏛️ 證據佐證分錄 / Evidence Vault Entry
 */
export interface IEvidenceVaultEntry {
    readonly asset: IEvidenceAsset;
    readonly signatures: IDigitalSignature[]; // Multi-sig support
    readonly status: 'VERIFIED' | 'PENDING' | 'REVOKED';
    readonly protocol: Protocol5T[]; // 通常包含 TRACEABLE, TRUSTWORTHY
}

/**
 * 🏹 透明驗算公式 / Transparent Formula
 * [TC] 描述一個數值是如何被評判出來的，包含權重與數據鏈。
 */
export interface ITransparentFormula {
    readonly finalScore: number;
    readonly items: IFormulaItem[];
    readonly dataChain: string[];     // 數據鏈：指向 Evidence ID 或中間過程 UUID
    readonly standard?: string;       // 參考標準 (如 GRI, SASB, ISO-14064)
}

/**
 * 📊 公式細項 / Formula Item
 */
export interface IFormulaItem {
    readonly label: string;           // 項目名稱 (例如：環境政策)
    readonly value: number;           // 原始得分
    readonly weight: number;          // 權重 (0-1)
    readonly evidenceId?: string;     // 關聯的佐證 ID [Traceable]
}
