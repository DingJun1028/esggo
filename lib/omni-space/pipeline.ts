import { NotionPagePayload, OmniEvent } from '../../types/omni-card';
import { NotionAdapter } from '../adapters/notion.adapter';
import { OmniEventStore } from './event-store';

/**
 * OmniAvatarPipeline: 萬能分身資料管線
 * 實踐「本質提純」->「熵減煉金」->「永恆刻印」
 */
export class OmniAvatarPipeline {
  /**
   * 從 Notion 進行資料同步
   */
  public static async syncFromNotion(payload: NotionPagePayload): Promise<OmniEvent> {
    // 1. 本質提純 (Essence Extraction) - 透過 Adapter 轉換為 OmniCard 契約
    const card = NotionAdapter.transform(payload);

    // 2. 熵減煉金 (Purification) - 封裝為具備 Hash Lock 的不可篡改事件
    const event = OmniEventStore.createEvent('CARD_SYNCED', card, 'Notion');

    // 3. 永恆刻印 (Eternal Engraving) - 寫入 GPL 資料庫 (Event Store)
    await OmniEventStore.saveEvent(event);

    return event;
  }
}
