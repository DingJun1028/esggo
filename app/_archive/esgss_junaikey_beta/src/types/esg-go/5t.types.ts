/**
 * 🔗 5T Protocol Compliance Types
 * Traceable, Trackable, Transparent, Trustworthy, Tangible
 */

export interface FiveTComplianceStatus {
    tangible: boolean;   // [可感知] 美 (Beauty) - 視覺化學習
    traceable: boolean;  // [可溯源] 真 (Truth) - 來源學習
    trackable: boolean;  // [可追蹤] 真 (Truth) - 路徑學習
    transparent: boolean; // [可驗算] 善 (Goodness) - 邏輯學習
    trustworthy: boolean; // [不可篡改] 信 (Trust) - 資產鎖定
}

export interface FiveTMetadata {
    hashLock?: string;
    sourceOrigin?: string;
    verificationLog?: string[];
    timestamp: Date;
}
