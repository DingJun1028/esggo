/**
 * Audit Repository
 * 處理 5T 審計日誌與完整性告警
 */

import { supabase, handleSupabaseError } from '../lib/supabase';
import { 
  AuditLog, 
  AuditQueryParams, 
  AuditAction, 
  AuditSeverity 
} from '../../shared/types/audit.types';
import { UserID } from '../../shared/types/evidence.types';

export class AuditRepository {
  /**
   * 記錄審計日誌
   */
  async log(entry: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog | undefined> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: entry.user_id,
          action: entry.action,
          severity: entry.severity,
          resource_type: entry.resource_type,
          resource_id: entry.resource_id,
          details: entry.details,
          ip_address: entry.ip_address,
          user_agent: entry.user_agent,
          session_id: entry.session_id,
        })
        .select()
        .single();

      if (error) handleSupabaseError(error);
      return data ? this.mapToAuditLog(data) : undefined;
    } catch (error) {
      handleSupabaseError(error);
      return undefined;
    }
  }

  /**
   * 查詢審計日誌
   */
  async findMany(params: AuditQueryParams) {
    try {
      let query = supabase.from('audit_logs').select('*', { count: 'exact' });

      if (params.user_id) query = query.eq('user_id', params.user_id);
      if (params.resource_id) query = query.eq('resource_id', params.resource_id);
      if (params.action) {
        if (Array.isArray(params.action)) query = query.in('action', params.action);
        else query = query.eq('action', params.action);
      }

      const limit = params.limit || 50;
      const offset = params.offset || 0;
      query = query.range(offset, offset + limit - 1).order('timestamp', { ascending: false });

      const { data, error, count } = await query;
      if (error) handleSupabaseError(error);

      return {
        data: (data || []).map(row => this.mapToAuditLog(row)),
        total: count || 0
      };
    } catch (error) {
      handleSupabaseError(error);
      return { data: [], total: 0 };
    }
  }

  private mapToAuditLog(row: Record<string, unknown>): AuditLog {
    return {
      id: row.id as string,
      user_id: row.user_id as UserID,
      action: row.action as AuditAction,
      severity: row.severity as AuditSeverity,
      resource_type: row.resource_type as 'evidence' | 'ucc' | 'user' | 'system',
      resource_id: row.resource_id as string,
      details: row.details as any, // details is complex JSON
      ip_address: row.ip_address as string | undefined,
      user_agent: row.user_agent as string | undefined,
      timestamp: new Date(row.timestamp as string),
      session_id: row.session_id as string | undefined,
    };
  }
}

export const auditRepository = new AuditRepository();
