/**
 * OmniBlueTable Service — Think Tank Registration & Sync
 * 提供 OmniBlueTable 體系與萬能智庫的統一操作介面。
 */

import { supabase } from '../lib/supabase';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { type ThinkTankRegistration, THINK_TANK_REGISTRY, getThinkTankRegistrations, getOmniBlueTablePractices } from '@/lib/agent/best-practice-registry';
import { type BestPractice } from '@/lib/agent/best-practice-registry';
import { aiTableBlueBridge } from '@/lib/services/omni-table-blue-bridge';

export class OmniBlueTableService {

  /**
   * 列出已登入萬能智庫的元件清單
   */
  getThinkTankRegistrations(category?: ThinkTankRegistration['category']): ThinkTankRegistration[] {
    return getThinkTankRegistrations(category);
  }

  /**
   * 查詢特定元件的智庫註冊資訊
   */
  getRegistration(component: string): ThinkTankRegistration | undefined {
    return THINK_TANK_REGISTRY.find(tr => tr.component === component);
  }

  /**
   * 查詢 OmniBlueTable 最佳實踐清單
   */
  getBestPractices(industry?: string) {
    return getOmniBlueTablePractices(industry);
  }

  /**
   * 將最佳實踐說明同步至 Supabase `best_practices` 表 (實作 5T T5 Trackable)
   */
  async syncBestPracticesToVault() {
    const practices = this.getBestPractices();
    // Directly create a service role client here
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Supabase URL or Service Role Key missing for admin client');
      return { success: false, error: 'Supabase URL or Service Role Key missing.' };
    }
    
    let serviceRoleSupabase: SupabaseClient | null = null;
    try {
      serviceRoleSupabase = createClient(supabaseUrl, serviceRoleKey);
    } catch (error) {
      console.error('Supabase Service Role Client initialization error:', error);
      return { success: false, error: 'Failed to initialize Supabase service role client.' };
    }

    const results = [];
    for (const bp of practices) {
      const { data, error } = await serviceRoleSupabase // Use serviceRoleSupabase for upsert
        .from('best_practices' as any)
        .upsert({
          id: bp.id,
          category: bp.category,
          industry: bp.industry,
          title: bp.title,
          strategy: bp.strategy,
          benchmark_source: bp.benchmark_source,
          t5_compliance: bp.t5_compliance,
          impact_score: bp.impact_score,
          tags: bp.tags,
          last_verified: bp.last_verified,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        results.push({ id: bp.id, success: false, error: error.message });
      } else {
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
      .from('omniblue_nodes' as any)
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
  triggerSyncMission(datasheetId: string) {
    return aiTableBlueBridge.syncMetricsToCloud(datasheetId);
  }
  /**
   * 查詢 OmniBlueTable 最佳實踐清單 (從 Supabase 獲取)
   */
  async getBestPracticesFromSupabase(): Promise<{ data: BestPractice[], error: string | null }> {
    const { data, error } = await supabase
      .from('best_practices')
      .select('*');

    if (error) {
      console.error('Error fetching best practices from Supabase:', error.message);
      return { data: [], error: error.message };
    }
    return { data: data as BestPractice[], error: null };
  }
}

export const omniBlueTableService = new OmniBlueTableService();
