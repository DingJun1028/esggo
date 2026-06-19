import sha256 from 'crypto-js/sha256';

/**
 * 🔒 OmniCrypto - 奧秘加密工具 (Frontend/Shared)
 * 
 * 負責 5T 協議中的 Trustworthy (不可篡改) 驗證。
 * 與 server/utils/crypto.ts 邏輯對齊。
 */
export class OmniCrypto {
    /**
     * 生成數據的 SHA-256 雜湊值 (Generate SHA-256 Hash)
     * @param data 任何可被轉換為字串的數據
     * @returns 16 進位的雜湊字串，帶有 SHA256: 前綴 (與伺服器端一致取前 32 位)
     */
    public static hash(data: any): string {
        const str = typeof data === 'string' ? data : JSON.stringify(data);
        const hash = sha256(str).toString();
        return `SHA256:${hash.substring(0, 32)}`;
    }

    /**
     * 驗證數據與雜湊值是否匹配 (Verify Hash)
     * @param data 原始數據
     * @param hash 待驗證的雜湊值
     * @returns boolean
     */
    public static verify(data: any, hash: string): boolean {
        const currentHash = this.hash(data);
        return currentHash === hash;
    }
}

export default OmniCrypto;
