import { OmniCard, OmniCardSchema } from '../../types/omni-card';
import { randomUUID } from 'crypto';

/**
 * AlTable 原始 Payload 結構契約
 */
export interface AlTableRecordPayload {
  recordId: string;
  fields: Record<string, any>;
  updatedTime: number;
}

/**
 * AlTable Adapter: 將 AlTable 異質數據轉化為 OmniCard 契約
 * 實踐「本質提純」與「協議優先」
 */
export class AlTableAdapter {
  /**
   * 將 AlTable 原始 Payload 轉換並淨化為 OmniCard
   * @param payload AlTable API 取得的 Record 結構
   * @returns 淨化且符合契約的 OmniCard
   */
  public static transform(payload: AlTableRecordPayload): OmniCard {
    // 從 fields 提取本質數據 (Traceable)
    const name = payload.fields['Name'] || 'Unknown Card';
    const statusVal = payload.fields['Status']?.toLowerCase();
    
    const validStatus = ['todo', 'doing', 'done'].includes(statusVal) ? statusVal : 'todo';

    const attributes = payload.fields['Attributes'] || [];
    const abilities = payload.fields['Abilities'] || [];

    const rawCard = {
      uuid: randomUUID(), // 若需溯源，可由 GPL 作對應映射
      name,
      attributes,
      abilities,
      status: validStatus,
      lastUpdated: payload.updatedTime,
    };

    // JunAIKey 協同：嚴格校驗資料合規性 (Transparent)
    return OmniCardSchema.parse(rawCard);
  }
}
