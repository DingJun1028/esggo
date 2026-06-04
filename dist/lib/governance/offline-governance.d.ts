/**
 * 離線治理模式 - Hash 驗證與 ZKP 離線計算儀器
 * 在離線環境中執行 BC5 掃描與密碼學驗證
 */
export interface HashVerificationResult {
    file: string;
    status: 'valid' | 'invalid' | 'missing';
    hash: string;
    expectedHash?: string;
}
export interface ZKPVerificationResult {
    proof: string;
    verification: boolean;
}
/**
 * BC5 掃描器 (Binary Consistency Checker)
 * 檢查二進制資料的一致性
 */
export declare function bc5Scanner(filePath: string): HashVerificationResult;
/**
 * 密碼學 Hash 鎖定器
 * 為檔案生成不可篡改的 Hash 鎖
 */
export declare function generateHashLock(content: string): string;
/**
 * ZKP 離線計算器 (Zero-Knowledge Proof Offline Calculator)
 * 在離線環境中執行 ZKP 驗證
 */
export declare function zkpOfflineCalculator(fileContent: string): ZKPVerificationResult;
/**
 * 離線驗證儀器
 * 結合 BC5 掃描與 ZKP 計算
 */
export declare function offlineVerification(filePath: string): {
    bc5: HashVerificationResult;
    zkp: ZKPVerificationResult;
};
//# sourceMappingURL=offline-governance.d.ts.map