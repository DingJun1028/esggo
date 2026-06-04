/**
 * OmniBlueTable Service — Think Tank Registration & Sync
 * 提供 OmniBlueTable 體系與萬能智庫的統一操作介面。
 */
import { type ThinkTankRegistration } from '@/lib/agent/best-practice-registry';
export declare class OmniBlueTableService {
    /**
     * 列出已登入萬能智庫的元件清單
     */
    getThinkTankRegistrations(category?: ThinkTankRegistration['category']): ThinkTankRegistration[];
    /**
     * 查詢特定元件的智庫註冊資訊
     */
    getRegistration(component: string): ThinkTankRegistration | undefined;
    /**
     * 查詢 OmniBlueTable 最佳實踐清單
     */
    getBestPractices(industry?: string): any;
    /**
     * 將最佳實踐說明同步至 Supabase `best_practices` 表 (實作 5T T5 Trackable)
     */
    syncBestPracticesToVault(): Promise<{
        success: boolean;
        synced: number;
        results: ({
            id: any;
            success: boolean;
            error: string;
            data?: undefined;
        } | {
            id: any;
            success: boolean;
            data: never;
            error?: undefined;
        })[];
    }>;
    /**
     * 取得 OmniTable × OmniBlue 同步任務狀態摘要
     * 從 Supabase `omniblue_nodes` 表取得最近同步紀錄
     */
    getSyncStatus(): Promise<{
        success: boolean;
        data: never[];
        error: string | null;
    }>;
    /**
     * 觸發 OmniBlue × OmniTable 同步 (委派給 OmniTableBlueBridge)
     */
    triggerSyncMission(datasheetId: string): any;
}
export declare const omniBlueTableService: OmniBlueTableService;
//# sourceMappingURL=omni-blue-table.service.d.ts.map