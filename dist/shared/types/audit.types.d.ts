import { z } from 'zod';
import type { EvidenceID, UserID } from './evidence.types';
export declare enum AuditAction {
    EVIDENCE_CREATE = "evidence_create",
    EVIDENCE_UPDATE = "evidence_update",
    EVIDENCE_DELETE = "evidence_delete",
    EVIDENCE_SEAL = "evidence_seal",
    EVIDENCE_ANCHOR = "evidence_anchor",
    EVIDENCE_VERIFY = "evidence_verify",
    EVIDENCE_VIEW = "evidence_view",
    EVIDENCE_DOWNLOAD = "evidence_download",
    EVIDENCE_SHARE = "evidence_share",
    EVIDENCE_ARCHIVE = "evidence_archive",
    UCC_CREATE = "ucc_create",
    UCC_UPDATE = "ucc_update",
    UCC_TAG_ADD = "ucc_tag_add",
    UCC_TAG_REMOVE = "ucc_tag_remove",
    UCC_RELATION_ADD = "ucc_relation_add",
    INTEGRITY_ALERT = "integrity_alert",
    INTEGRITY_CHECK = "integrity_check",
    TAMPER_DETECTED = "tamper_detected",
    USER_LOGIN = "user_login",
    USER_LOGOUT = "user_logout",
    USER_PERMISSION_CHANGE = "user_permission_change"
}
export declare enum AuditSeverity {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical"
}
export interface AuditLog {
    id: string;
    user_id: UserID;
    action: AuditAction;
    severity: AuditSeverity;
    resource_type: 'evidence' | 'ucc' | 'user' | 'system';
    resource_id: string;
    details: AuditDetails;
    ip_address?: string;
    user_agent?: string;
    timestamp: Date;
    session_id?: string;
}
export interface AuditDetails {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
    changes?: ChangeRecord[];
    reason?: string;
    metadata?: Record<string, unknown>;
    error?: {
        message: string;
        stack?: string;
        code?: string;
    };
}
export interface ChangeRecord {
    field: string;
    old_value: unknown;
    new_value: unknown;
    changed_at: Date;
}
export interface AuditQueryParams {
    user_id?: UserID;
    action?: AuditAction | AuditAction[];
    severity?: AuditSeverity | AuditSeverity[];
    resource_type?: string;
    resource_id?: string;
    from_date?: Date;
    to_date?: Date;
    limit?: number;
    offset?: number;
}
export declare enum AlertType {
    HASH_MISMATCH = "hash_mismatch",
    BLOCKCHAIN_MISMATCH = "blockchain_mismatch",
    UNAUTHORIZED_ACCESS = "unauthorized_access",
    SUSPICIOUS_ACTIVITY = "suspicious_activity",
    DATA_CORRUPTION = "data_corruption"
}
export declare enum AlertStatus {
    OPEN = "open",
    INVESTIGATING = "investigating",
    RESOLVED = "resolved",
    FALSE_POSITIVE = "false_positive"
}
export interface IntegrityAlert {
    id: string;
    evidence_id: EvidenceID;
    alert_type: AlertType;
    severity: AuditSeverity;
    status: AlertStatus;
    description: string;
    details: {
        expected_hash?: string;
        actual_hash?: string;
        blockchain_tx?: string;
        detection_method?: string;
        affected_fields?: string[];
    };
    detected_at: Date;
    resolved_at?: Date;
    resolved_by?: UserID;
    resolution_notes?: string;
}
export declare const AuditDetailsSchema: z.ZodObject<{
    before: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    after: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    changes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        old_value: z.ZodUnknown;
        new_value: z.ZodUnknown;
        changed_at: z.ZodCoercedDate<unknown>;
    }, z.core.$strip>>>;
    reason: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    error: z.ZodOptional<z.ZodObject<{
        message: z.ZodString;
        stack: z.ZodOptional<z.ZodString>;
        code: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const CreateAuditLogDTOSchema: z.ZodObject<{
    user_id: z.ZodString;
    action: z.ZodEnum<typeof AuditAction>;
    severity: z.ZodDefault<z.ZodEnum<typeof AuditSeverity>>;
    resource_type: z.ZodEnum<{
        user: "user";
        evidence: "evidence";
        ucc: "ucc";
        system: "system";
    }>;
    resource_id: z.ZodString;
    details: z.ZodObject<{
        before: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        after: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        changes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            old_value: z.ZodUnknown;
            new_value: z.ZodUnknown;
            changed_at: z.ZodCoercedDate<unknown>;
        }, z.core.$strip>>>;
        reason: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        error: z.ZodOptional<z.ZodObject<{
            message: z.ZodString;
            stack: z.ZodOptional<z.ZodString>;
            code: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    ip_address: z.ZodOptional<z.ZodString>;
    user_agent: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const AuditQueryParamsSchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodString>;
    action: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<typeof AuditAction>, z.ZodArray<z.ZodEnum<typeof AuditAction>>]>>;
    severity: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<typeof AuditSeverity>, z.ZodArray<z.ZodEnum<typeof AuditSeverity>>]>>;
    resource_type: z.ZodOptional<z.ZodString>;
    resource_id: z.ZodOptional<z.ZodString>;
    from_date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    to_date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=audit.types.d.ts.map