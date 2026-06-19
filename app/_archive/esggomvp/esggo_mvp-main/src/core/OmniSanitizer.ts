import DOMPurify from 'dompurify';

/**
 * 🛡️ OmniSanitizer - XSS 防護清洗器
 * 
 * 負責全站輸入文本的安全性清洗，確保「知識即資產」的誠信不受惡意代碼威脅。
 */
export class OmniSanitizer {
    private static purifier = typeof window !== 'undefined' ? DOMPurify : null;

    /**
     * 清洗 HTML/純文本內容
     */
    public static sanitize(content: string): string {
        if (!this.purifier && typeof window !== 'undefined') {
            this.purifier = DOMPurify;
        }

        if (this.purifier) {
            return this.purifier.sanitize(content);
        }

        // 伺服器端降級處理 (Basic regex based sanitization)
        return content
            .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, '')
            .replace(/on\w+="[^"]*"/gm, '')
            .replace(/href="javascript:[^"]*"/gm, '');
    }

    /**
     * 專門針對 5T 協議的數據清洗，過濾非預期字符
     */
    public static cleanDataPoint(val: string): string {
        return val.trim().replace(/[<>"{}]/g, '');
    }
}
