import { omniLogger, LogCategory } from './omniLogger';

/**
 * 🧹 OmniDataCleanser: 數據清洗與規一化中心
 * 職責：去除噪音、提取實體、格式對齊
 */
export class OmniDataCleanser {

    /**
     * ✨ cleanse: 執行數據清洗
     */
    public static cleanse(rawData: any): any {
        omniLogger.info(LogCategory.SYSTEM, `OmniCleanser: Refining raw data for identity stability...`);

        let cleaned = { ...rawData };

        // 1. 去除 HTML 標籤 (基本正則)
        if (typeof cleaned.content === 'string') {
            cleaned.content = cleaned.content.replace(/<[^>]*>?/gm, '');
            cleaned.content = cleaned.content.trim();
        }

        // 2. 實體提取 (關鍵字對照)
        const entities = this.extractEntities(cleaned.content || '');
        cleaned.entities = entities;

        // 3. 語義強度計算
        cleaned.sentimentScore = this.calculateSentiment(cleaned.content || '');

        return cleaned;
    }

    /**
     * 🔍 extractEntities: 提取關鍵實體
     */
    private static extractEntities(text: string): string[] {
        const keywords = ['金管會', 'FSC', '證交所', 'GRI', 'ISSB', '碳稅', 'CBAM', '永續學會'];
        return keywords.filter(k => text.includes(k));
    }

    /**
     * 📊 calculateSentiment: 簡單語義分析 (0-1)
     */
    private static calculateSentiment(text: string): number {
        const positive = ['領先', '優化', '達成', '採納', '進展'];
        const negative = ['預警', '風險', '波動', '警告', '爭議'];

        let score = 0.5;
        positive.forEach(p => { if (text.includes(p)) score += 0.1; });
        negative.forEach(n => { if (text.includes(n)) score -= 0.1; });

        return Math.max(0, Math.min(1, score));
    }
}
