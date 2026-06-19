/**
 * 🔐 Hash Lock Utility — ESG GO Omni Layer (Trust Module)
 * 
 * 實作數位契約 (Hash Lock) 功能。
 * 用於將資料轉換為 SHA-256 特徵碼，並結合 Object.freeze() 鎖定物件狀態，
 * 確保報告查證與證據儲存過程中的數據不可篡改性。
 */

/**
 * 將給定的字串或物件內容計算其 SHA-256 Hash
 */
export async function generateHashLock(data: any): Promise<string> {
    const text = typeof data === 'string' ? data : JSON.stringify(data, Object.keys(data).sort());

    // Web Crypto API
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

    // 轉換為 Hex 字串
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

/**
 * 用於計算檔案的 Hash 值 (用於 Evidence Vault 檔案上傳前快照)
 */
export async function generateFileHashLock(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 驗算兩個 Hash 是否匹配 (驗證不可篡改性)
 */
export function verifyHash(originalHash: string, dataToVerify: string): boolean {
    return originalHash === dataToVerify;
}

/**
 * 將物件凍結，確保其在前端生命週期內無法被修改 (證果 / 鎖定真理)
 * 結合 Hash，提供一個「數位合約」的資料結構。
 */
export async function sealDigitalContract<T extends object>(payload: T): Promise<{ lockedData: Readonly<T>, signature: string }> {
    const signature = await generateHashLock(payload);
    // 凍結物件
    const lockedData = Object.freeze({ ...payload });

    return {
        lockedData,
        signature
    };
}
