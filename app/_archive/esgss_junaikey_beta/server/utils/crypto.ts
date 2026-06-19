import { createHash } from 'crypto';

/**
 * 🔒 OmniCrypto - 奧秘加密工具
 * 
 * 負責 5T 協議中的 Trustworthy (不可篡改) 驗證。
 * 使用 SHA-256 算法生成與驗證數據指紋。
 */
export class OmniCrypto {
    /**
     * 生成數據的 SHA-256 雜湊值 (Generate SHA-256 Hash)
     * @param data 任何可被轉換為字串的數據
     * @returns 16 進位的雜湊字串，帶有 SHA256: 前綴
     */
    public static hash(data: any): string {
        const str = typeof data === 'string' ? data : JSON.stringify(data);
        const hash = createHash('sha256').update(str).digest('hex');
        return `SHA256:${hash.substring(0, 32)}`; // 我們只取前 32 位作為精簡指紋
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
