import { z } from 'zod';
// ============================================
// 審計日誌型別
// ============================================
export var AuditAction;
(function (AuditAction) {
    // Evidence actions
    AuditAction["EVIDENCE_CREATE"] = "evidence_create";
    AuditAction["EVIDENCE_UPDATE"] = "evidence_update";
    AuditAction["EVIDENCE_DELETE"] = "evidence_delete";
    AuditAction["EVIDENCE_SEAL"] = "evidence_seal";
    AuditAction["EVIDENCE_ANCHOR"] = "evidence_anchor";
    AuditAction["EVIDENCE_VERIFY"] = "evidence_verify";
    AuditAction["EVIDENCE_VIEW"] = "evidence_view";
    AuditAction["EVIDENCE_DOWNLOAD"] = "evidence_download";
    AuditAction["EVIDENCE_SHARE"] = "evidence_share";
    AuditAction["EVIDENCE_ARCHIVE"] = "evidence_archive";
    // UCC actions
    AuditAction["UCC_CREATE"] = "ucc_create";
    AuditAction["UCC_UPDATE"] = "ucc_update";
    AuditAction["UCC_TAG_ADD"] = "ucc_tag_add";
    AuditAction["UCC_TAG_REMOVE"] = "ucc_tag_remove";
    AuditAction["UCC_RELATION_ADD"] = "ucc_relation_add";
    // Integrity actions
    AuditAction["INTEGRITY_ALERT"] = "integrity_alert";
    AuditAction["INTEGRITY_CHECK"] = "integrity_check";
    AuditAction["TAMPER_DETECTED"] = "tamper_detected";
    // User actions
    AuditAction["USER_LOGIN"] = "user_login";
    AuditAction["USER_LOGOUT"] = "user_logout";
    AuditAction["USER_PERMISSION_CHANGE"] = "user_permission_change";
})(AuditAction || (AuditAction = {}));
export var AuditSeverity;
(function (AuditSeverity) {
    AuditSeverity["INFO"] = "info";
    AuditSeverity["WARNING"] = "warning";
    AuditSeverity["ERROR"] = "error";
    AuditSeverity["CRITICAL"] = "critical";
})(AuditSeverity || (AuditSeverity = {}));
// ============================================
// 完整性告警
// ============================================
export var AlertType;
(function (AlertType) {
    AlertType["HASH_MISMATCH"] = "hash_mismatch";
    AlertType["BLOCKCHAIN_MISMATCH"] = "blockchain_mismatch";
    AlertType["UNAUTHORIZED_ACCESS"] = "unauthorized_access";
    AlertType["SUSPICIOUS_ACTIVITY"] = "suspicious_activity";
    AlertType["DATA_CORRUPTION"] = "data_corruption";
})(AlertType || (AlertType = {}));
export var AlertStatus;
(function (AlertStatus) {
    AlertStatus["OPEN"] = "open";
    AlertStatus["INVESTIGATING"] = "investigating";
    AlertStatus["RESOLVED"] = "resolved";
    AlertStatus["FALSE_POSITIVE"] = "false_positive";
})(AlertStatus || (AlertStatus = {}));
// ============================================
// Zod Schema 驗證器
// ============================================
export const AuditDetailsSchema = z.object({
    before: z.record(z.string(), z.unknown()).optional(),
    after: z.record(z.string(), z.unknown()).optional(),
    changes: z.array(z.object({
        field: z.string(),
        old_value: z.unknown(),
        new_value: z.unknown(),
        changed_at: z.coerce.date(),
    })).optional(),
    reason: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    error: z.object({
        message: z.string(),
        stack: z.string().optional(),
        code: z.string().optional(),
    }).optional(),
});
export const CreateAuditLogDTOSchema = z.object({
    user_id: z.string().uuid(),
    action: z.nativeEnum(AuditAction),
    severity: z.nativeEnum(AuditSeverity).default(AuditSeverity.INFO),
    resource_type: z.enum(['evidence', 'ucc', 'user', 'system']),
    resource_id: z.string(),
    details: AuditDetailsSchema,
    ip_address: z.string().optional(),
    user_agent: z.string().optional(),
});
export const AuditQueryParamsSchema = z.object({
    user_id: z.string().uuid().optional(),
    action: z.union([
        z.nativeEnum(AuditAction),
        z.array(z.nativeEnum(AuditAction)),
    ]).optional(),
    severity: z.union([
        z.nativeEnum(AuditSeverity),
        z.array(z.nativeEnum(AuditSeverity)),
    ]).optional(),
    resource_type: z.string().optional(),
    resource_id: z.string().optional(),
    from_date: z.coerce.date().optional(),
    to_date: z.coerce.date().optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
});
//# sourceMappingURL=audit.types.js.map