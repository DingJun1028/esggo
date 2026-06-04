import { OmniCard } from '@/src/shared/types';
/**
 * AlTable 原始 Payload 結構契約
 */
export interface AlTableRecordPayload {
    recordId: string;
    fields: Record<string, unknown>;
    updatedTime: number;
}
/**
 * AlTable Adapter: 將 AlTable 異質數據轉化為 OmniCard 契約
 * 實踐「本質提純」與「協議優先」
 */
export declare class AlTableAdapter {
    /**
     * 將 AlTable 原始 Payload 轉換並淨化為 OmniCard
     * @param payload AlTable API 取得的 Record 結構
     * @returns 淨化且符合契約的 OmniCard
     */
    static transform(payload: AlTableRecordPayload): OmniCard;
}
//# sourceMappingURL=altable.adapter.d.ts.map