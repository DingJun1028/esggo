/**
 * OmniBlueTable Service — Think Tank Registration & Sync
 * 提供 OmniBlueTable 體系與萬能智庫的統一操作介面。
 */
import { supabase } from '../lib/supabase';
import { THINK_TANK_REGISTRY, getThinkTankRegistrations } from '@/lib/agent/best-practice-registry';
import { getOmniBlueTablePractices } from '@/lib/agent/best-practice-registry';
import { aiTableBlueBridge } from '@/lib/services/omni-table-blue-bridge';
export class OmniBlueTableService {
    /**
     * 列出已登入萬能智庫的元件清單
     */
    getThinkTankRegistrations(category) {
        return getThinkTankRegistrations(category);
    }
    /**
     * 查詢特定元件的智庫註冊資訊
     */
    getRegistration(component) {
        return THINK_TANK_REGISTRY.find(tr => tr.component === component);
    }
    /**
     * 查詢 OmniBlueTable 最佳實踐清單
     */
    getBestPractices(industry) {
        return getOmniBlueTablePractices(industry);
    }
    /**
     * 將最佳實踐說明同步至 Supabase `best_practices` 表 (實作 5T T5 Trackable)
     */
    async syncBestPracticesToVault() {
        const practices = this.getBestPractices();
        const results = [];
        for (const bp of practices) {
            const { data, error } = await supabase
                .from('best_practices')
                .upsert({
                id: bp.id,
                category: bp.category,
                industry: bp.industry,
                title: bp.title,
                strategy: bp.strategy,
                benchmark_source: bp.benchmark_source,
                impact_score: bp.impact_score,
                tags: bp.tags,
                t5_compliance: bp.t5_compliance,
                last_verified: bp.last_verified,
                updated_at: new Date().toISOString(),
            })
                .select()
                .single();
            if (error) {
                results.push({ id: bp.id, success: false, error: error.message });
            }
            else {
                results.push({ id: bp.id, success: true, data });
            }
        }
        return { success: true, synced: results.length, results };
    }
    /**
     * 取得 OmniTable × OmniBlue 同步任務狀態摘要
     * 從 Supabase `omniblue_nodes` 表取得最近同步紀錄
     */
    async getSyncStatus() {
        const { data, error } = await supabase
            .from('omniblue_nodes')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
        return {
            success: !error,
            data: error ? [] : (data ?? []),
            error: error?.message || null,
        };
    }
    /**
     * 觸發 OmniBlue × OmniTable 同步 (委派給 OmniTableBlueBridge)
     */
    triggerSyncMission(datasheetId) {
        return aiTableBlueBridge.syncMetricsToCloud(datasheetId);
    }
}
export const omniBlueTableService = new OmniBlueTableService();
//# sourceMappingURL=omni-blue-table.service.js.map