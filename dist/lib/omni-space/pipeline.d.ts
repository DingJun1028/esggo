import { NotionPagePayload, OmniEvent, OmniCard } from '@/src/shared/types';
export type PipelineMiddleware = (card: OmniCard) => Promise<OmniCard>;
/**
 * OmniAvatarPipeline: 萬能分身資料管線
 * 實踐「本質提純」->「熵減煉金」->「永恆刻印」
 */
export declare class OmniAvatarPipeline {
    private middlewares;
    use(middleware: PipelineMiddleware): this;
    /**
     * 從 Notion 進行資料同步
     */
    syncFromNotion(payload: NotionPagePayload): Promise<OmniEvent>;
}
//# sourceMappingURL=pipeline.d.ts.map