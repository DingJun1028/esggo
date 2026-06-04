import { OmniCard, NotionPagePayload } from '@/src/shared/types';
/**
 * Notion Adapter: 將 Notion 異質數據轉化為 OmniCard 契約
 * 實踐「本質提純」與「協議優先」
 */
export declare class NotionAdapter {
    /**
     * 將 Notion 原始 Payload 轉換並淨化為 OmniCard
     * @param payload Notion Webhook 或 API 取得的 Page 結構
     * @returns 淨化且符合契約的 OmniCard
     */
    static transform(payload: NotionPagePayload): OmniCard;
}
//# sourceMappingURL=notion.adapter.d.ts.map