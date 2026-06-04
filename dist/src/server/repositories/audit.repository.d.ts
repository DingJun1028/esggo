/**
 * Audit Repository
 * 處理 5T 審計日誌與完整性告警
 */
import { AuditLog, AuditQueryParams } from '../../shared/types/audit.types';
export declare class AuditRepository {
    /**
     * 記錄審計日誌
     */
    log(entry: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog | undefined>;
    /**
     * 查詢審計日誌
     */
    findMany(params: AuditQueryParams): Promise<{
        data: AuditLog[];
        total: number;
    }>;
    private mapToAuditLog;
}
export declare const auditRepository: AuditRepository;
//# sourceMappingURL=audit.repository.d.ts.map