/**
 * Evidence Repository
 * 資料存取層 - 處理所有與 Evidence 相關的資料庫操作
 */

import { supabase, handleSupabaseError } from '../lib/supabase';
import type {
  Evidence,
  EvidenceID,
  UserID,
  ContentHash,
  BlockchainTxHash,
  EvidenceMetadata,
  EvidenceStatus,
  IntegrityStatus,
  EvidenceQueryParams,
  PaginatedResult,
  CreateEvidenceDTO,
  UpdateEvidenceDTO,
} from '../../shared/types/evidence.types';
import { computeSHA256 } from '../../shared/utils/hash.utils';

// ============================================
// Evidence Repository Class
// ============================================

export class EvidenceRepository {
  /**
   * 創建證據
   */
  async create(
    userId: UserID,
    data: CreateEvidenceDTO
  ): Promise<Evidence | undefined> {
    try {
      // 計算內容雜湊
      const contentHash = await computeSHA256(data.content);
      
      // 計算過期時間
      const expiresAt = data.expires_in_days
        ? new Date(Date.now() + data.expires_in_days * 24 * 60 * 60 * 1000)
        : null;
      
      const { data: evidence, error } = await supabase
        .from('evidences')
        .insert({
          user_id: userId,
          tag: data.tag,
          content: data.content,
          content_type: data.content_type,
          content_hash: contentHash,
          metadata: (data.metadata as Record<string, unknown>) || null,
          status: data.auto_seal ? 'sealed' : 'draft',
          integrity_status: 'unverified',
          sealed_at: data.auto_seal ? new Date().toISOString() : null,
          expires_at: expiresAt?.toISOString() || null,
          blockchain_tx: null,
          archived_at: null
        })
        .select()
        .single();
      
      if (error) handleSupabaseError(error);
      
      return evidence ? this.mapToEvidence(evidence) : undefined;
    } catch (error) {
      handleSupabaseError(error);
      return undefined;
    }
  }
  
  /**
   * 根據 ID 查詢證據
   */
  async findById(id: EvidenceID): Promise<Evidence | null> {
    try {
      const { data, error } = await supabase
        .from('evidences')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // 未找到
        handleSupabaseError(error);
      }
      
      return data ? this.mapToEvidence(data) : null;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }
  
  /**
   * 查詢證據列表（支援分頁與篩選）
   */
  async findMany(
    params: EvidenceQueryParams
  ): Promise<PaginatedResult<Evidence>> {
    try {
      let query = supabase.from('evidences').select('*', { count: 'exact' });
      
      // 應用篩選條件
      if (params.user_id) {
        query = query.eq('user_id', params.user_id);
      }
      
      if (params.status) {
        if (Array.isArray(params.status)) {
          query = query.in('status', params.status);
        } else {
          query = query.eq('status', params.status);
        }
      }
      
      if (params.integrity_status) {
        query = query.eq('integrity_status', params.integrity_status);
      }
      
      if (params.created_after) {
        query = query.gte('created_at', params.created_after.toISOString());
      }
      
      if (params.created_before) {
        query = query.lte('created_at', params.created_before.toISOString());
      }
      
      if (params.tag_contains) {
        query = query.ilike('tag', `%${params.tag_contains}%`);
      }
      
      // 排序
      const sortBy = params.sort_by || 'created_at';
      const sortOrder = params.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      
      // 分頁
      const limit = params.limit || 20;
      const offset = params.offset || 0;
      query = query.range(offset, offset + limit - 1);
      
      const { data, error, count } = await query;
      
      if (error) handleSupabaseError(error);
      
      return {
        data: (data || []).map((row: Record<string, unknown>) => this.mapToEvidence(row)),
        pagination: {
          total: count || 0,
          limit,
          offset,
          has_more: (count || 0) > offset + limit,
        },
      };
    } catch (error) {
      handleSupabaseError(error);
      return { data: [], pagination: { total: 0, limit: 20, offset: 0, has_more: false } };
    }
  }

  /**
   * 更新證據
   */
  async update(id: EvidenceID, data: UpdateEvidenceDTO): Promise<Evidence | undefined> {
    try {
      const { data: updated, error } = await supabase
        .from('evidences')
        .update({
          tag: data.tag,
          metadata: (data.metadata as Record<string, unknown>) || undefined,
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) handleSupabaseError(error);
      return updated ? this.mapToEvidence(updated) : undefined;
    } catch (error) {
      handleSupabaseError(error);
      return undefined;
    }
  }

  /**
   * 映射資料庫行到 Evidence 型別
   */
  private mapToEvidence(row: Record<string, unknown>): Evidence {
    return {
      id: row.id as EvidenceID,
      user_id: row.user_id as UserID,
      tag: row.tag as string,
      content: row.content as string,
      content_type: row.content_type as string,
      content_hash: row.content_hash as ContentHash,
      metadata: row.metadata as EvidenceMetadata | undefined,
      status: row.status as EvidenceStatus,
      integrity_status: row.integrity_status as IntegrityStatus,
      blockchain_tx: row.blockchain_tx as BlockchainTxHash | undefined,
      created_at: new Date(row.created_at as string),
      updated_at: new Date(row.updated_at as string),
      sealed_at: row.sealed_at ? new Date(row.sealed_at as string) : undefined,
      expires_at: row.expires_at ? new Date(row.expires_at as string) : undefined,
      archived_at: row.archived_at ? new Date(row.archived_at as string) : undefined,
    };
  }
}
