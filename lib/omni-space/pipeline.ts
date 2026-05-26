import { NotionPagePayload, OmniEvent, OmniCard } from '../../types/omni-card';
import { NotionAdapter } from '../adapters/notion.adapter';
import { OmniEventStore } from './event-store';

export type PipelineMiddleware = (card: OmniCard) => Promise<OmniCard>;

/**
 * OmniAvatarPipeline: 萬能分身資料管線
 * 實踐「本質提純」->「熵減煉金」->「永恆刻印」
 */
export class OmniAvatarPipeline {
  private middlewares: PipelineMiddleware[] = [];

  public use(middleware: PipelineMiddleware): this {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * 從 Notion 進行資料同步
   */
  public async syncFromNotion(payload: NotionPagePayload): Promise<OmniEvent> {
    // 1. 本質提純 (Essence Extraction) - 透過 Adapter 轉換為 OmniCard 契約
    let card = NotionAdapter.transform(payload);

    // 2. 執行 Middleware 管線 (如 AI 提純、格式修復)
    try {
      for (const middleware of this.middlewares) {
        card = await middleware(card);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[OmniAvatarPipeline] 中介層處理失敗，同步中斷: ${errorMessage}`);
      throw new Error(`Pipeline execution aborted: ${errorMessage}`);
    }

    // 3. 熵減煉金 (Purification) - 封裝為具備 Hash Lock 的不可篡改事件
    const event = OmniEventStore.createEvent('CARD_SYNCED', card, 'Notion');

    // 4. 永恆刻印 (Eternal Engraving) - 寫入 GPL 資料庫 (Event Store)
    await OmniEventStore.saveEvent(event);

    return event;
  }
}
