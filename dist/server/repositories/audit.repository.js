"use strict";
/**
 * Audit Repository
 * 處理 5T 審計日誌與完整性告警
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditRepository = exports.AuditRepository = void 0;
const supabase_1 = require("../lib/supabase");
class AuditRepository {
    /**
     * 記錄審計日誌
     */
    async log(entry) {
        try {
            const { data, error } = await supabase_1.supabase
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
            if (error)
                (0, supabase_1.handleSupabaseError)(error);
            return data ? this.mapToAuditLog(data) : undefined;
        }
        catch (error) {
            (0, supabase_1.handleSupabaseError)(error);
            return undefined;
        }
    }
    /**
     * 查詢審計日誌
     */
    async findMany(params) {
        try {
            let query = supabase_1.supabase.from('audit_logs').select('*', { count: 'exact' });
            if (params.user_id)
                query = query.eq('user_id', params.user_id);
            if (params.resource_id)
                query = query.eq('resource_id', params.resource_id);
            if (params.action) {
                if (Array.isArray(params.action))
                    query = query.in('action', params.action);
                else
                    query = query.eq('action', params.action);
            }
            const limit = params.limit || 50;
            const offset = params.offset || 0;
            query = query.range(offset, offset + limit - 1).order('timestamp', { ascending: false });
            const { data, error, count } = await query;
            if (error)
                (0, supabase_1.handleSupabaseError)(error);
            return {
                data: (data || []).map(row => this.mapToAuditLog(row)),
                total: count || 0
            };
        }
        catch (error) {
            (0, supabase_1.handleSupabaseError)(error);
            return { data: [], total: 0 };
        }
    }
    mapToAuditLog(row) {
        return {
            id: row.id,
            user_id: row.user_id,
            action: row.action,
            severity: row.severity,
            resource_type: row.resource_type,
            resource_id: row.resource_id,
            details: row.details, // details is complex JSON
            ip_address: row.ip_address,
            user_agent: row.user_agent,
            timestamp: new Date(row.timestamp),
            session_id: row.session_id,
        };
    }
}
exports.AuditRepository = AuditRepository;
exports.auditRepository = new AuditRepository();
//# sourceMappingURL=audit.repository.js.map