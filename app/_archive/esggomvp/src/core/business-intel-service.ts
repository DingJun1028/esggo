import { IOmniAtom } from './omni-types';
import { omniSyncCenter } from './omni-user-sync-center';
import { omniLogger, LogCategory } from './omniLogger';
import { OmniCrawlerService } from './omni-crawler-service';
import { OmniDataCleanser } from './omni-data-cleanser';

/**
 * 🔍 BusinessIntelService: 商業偵情採集服務
 * 職責：掃描外部市場 ESG 趨勢與競品動態，並轉化為 5T 原子。
 */
export class BusinessIntelService {

    /**
     * 🛰️ gatherIntel: 採集最新市場偵情 (包含大規模掃描)
     */
    public static async gatherIntel(): Promise<IOmniAtom<any>[]> {
        omniLogger.info(LogCategory.SYSTEM, 'BusinessIntel: Gathering combined intelligence from internal scouts and global crawlers...');

        // 1. 執行萬能掃描中心 (30+ 情報源)
        const crawlerIntel = await OmniCrawlerService.runGlobalScan();

        // 2. 模擬偵情採集 (自定義偵察)
        const rawIntel = [
            {
                title: '再生能源憑證 (REC) 市場波動',
                category: 'Market_Price',
                content: '本週亞洲市場再生能源憑證價格上漲 5%，建議提前鎖定配額。',
                impact: 'Medium',
                competitorStatus: 'N/A'
            }
        ];

        const scoutIntel: IOmniAtom<any>[] = [];

        for (const raw of rawIntel) {
            const cleansed = OmniDataCleanser.cleanse(raw);
            const atom = await omniSyncCenter.mapAndTag({
                ...cleansed,
                domain: 'BUSINESS-INTEL',
                impactMetric: `情報強度: ${raw.impact} | 類別: ${raw.category} | 語義得分: ${cleansed.sentimentScore}`
            });
            await omniSyncCenter.dispatch(atom);
            scoutIntel.push(atom);
        }

        return [...crawlerIntel, ...scoutIntel];
    }
}
