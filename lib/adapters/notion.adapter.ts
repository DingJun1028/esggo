import { OmniCard, OmniCardSchema, NotionPagePayload } from '@/src/shared/types';
import { randomUUID } from 'crypto';

/**
 * Notion Adapter: 將 Notion 異質數據轉化為 OmniCard 契約
 * 實踐「本質提純」與「協議優先」
 */
export class NotionAdapter {
  /**
   * 將 Notion 原始 Payload 轉換並淨化為 OmniCard
   * @param payload Notion Webhook 或 API 取得的 Page 結構
   * @returns 淨化且符合契約的 OmniCard
   */
  public static transform(payload: NotionPagePayload): OmniCard {
    const props = payload.properties as Record<string, any>;
    const name = props['Name']?.title?.[0]?.plain_text || 'Unknown Card';
    const statusVal = props['Status']?.status?.name?.toLowerCase();
    
    const validStatus = ['todo', 'doing', 'done'].includes(statusVal) ? statusVal : 'todo';

    const attributes = props['Attributes']?.multi_select?.map((s: any) => s.name) || [];
    const abilities = props['Abilities']?.multi_select?.map((s: any) => s.name) || [];

    const rawCard = {
      uuid: randomUUID(), // 若需溯源，可將 Notion ID 經 Hash Lock 轉為 UUID (Traceable)
      name,
      attributes,
      abilities,
      status: validStatus,
      lastUpdated: new Date(payload.last_edited_time).getTime(),
    };

    // JunAIKey 協同：嚴格校驗資料合規性 (Transparent)
    return OmniCardSchema.parse(rawCard);
  }
}