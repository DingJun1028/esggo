"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditQueryParamsSchema = exports.CreateAuditLogDTOSchema = exports.AuditDetailsSchema = exports.AlertStatus = exports.AlertType = exports.AuditSeverity = exports.AuditAction = void 0;
const zod_1 = require("zod");
// ============================================
// 審計日誌型別
// ============================================
var AuditAction;
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
})(AuditAction || (exports.AuditAction = AuditAction = {}));
var AuditSeverity;
(function (AuditSeverity) {
    AuditSeverity["INFO"] = "info";
    AuditSeverity["WARNING"] = "warning";
    AuditSeverity["ERROR"] = "error";
    AuditSeverity["CRITICAL"] = "critical";
})(AuditSeverity || (exports.AuditSeverity = AuditSeverity = {}));
// ============================================
// 完整性告警
// ============================================
var AlertType;
(function (AlertType) {
    AlertType["HASH_MISMATCH"] = "hash_mismatch";
    AlertType["BLOCKCHAIN_MISMATCH"] = "blockchain_mismatch";
    AlertType["UNAUTHORIZED_ACCESS"] = "unauthorized_access";
    AlertType["SUSPICIOUS_ACTIVITY"] = "suspicious_activity";
    AlertType["DATA_CORRUPTION"] = "data_corruption";
})(AlertType || (exports.AlertType = AlertType = {}));
var AlertStatus;
(function (AlertStatus) {
    AlertStatus["OPEN"] = "open";
    AlertStatus["INVESTIGATING"] = "investigating";
    AlertStatus["RESOLVED"] = "resolved";
    AlertStatus["FALSE_POSITIVE"] = "false_positive";
})(AlertStatus || (exports.AlertStatus = AlertStatus = {}));
// ============================================
// Zod Schema 驗證器
// ============================================
exports.AuditDetailsSchema = zod_1.z.object({
    before: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    after: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    changes: zod_1.z.array(zod_1.z.object({
        field: zod_1.z.string(),
        old_value: zod_1.z.unknown(),
        new_value: zod_1.z.unknown(),
        changed_at: zod_1.z.coerce.date(),
    })).optional(),
    reason: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    error: zod_1.z.object({
        message: zod_1.z.string(),
        stack: zod_1.z.string().optional(),
        code: zod_1.z.string().optional(),
    }).optional(),
});
exports.CreateAuditLogDTOSchema = zod_1.z.object({
    user_id: zod_1.z.string().uuid(),
    action: zod_1.z.nativeEnum(AuditAction),
    severity: zod_1.z.nativeEnum(AuditSeverity).default(AuditSeverity.INFO),
    resource_type: zod_1.z.enum(['evidence', 'ucc', 'user', 'system']),
    resource_id: zod_1.z.string(),
    details: exports.AuditDetailsSchema,
    ip_address: zod_1.z.string().optional(),
    user_agent: zod_1.z.string().optional(),
});
exports.AuditQueryParamsSchema = zod_1.z.object({
    user_id: zod_1.z.string().uuid().optional(),
    action: zod_1.z.union([
        zod_1.z.nativeEnum(AuditAction),
        zod_1.z.array(zod_1.z.nativeEnum(AuditAction)),
    ]).optional(),
    severity: zod_1.z.union([
        zod_1.z.nativeEnum(AuditSeverity),
        zod_1.z.array(zod_1.z.nativeEnum(AuditSeverity)),
    ]).optional(),
    resource_type: zod_1.z.string().optional(),
    resource_id: zod_1.z.string().optional(),
    from_date: zod_1.z.coerce.date().optional(),
    to_date: zod_1.z.coerce.date().optional(),
    limit: zod_1.z.number().min(1).max(100).default(50),
    offset: zod_1.z.number().min(0).default(0),
});
//# sourceMappingURL=audit.types.js.map