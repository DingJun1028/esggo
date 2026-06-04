"use strict";
/**
 * 證據核心型別定義
 * 前後端共享，確保型別一致性
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvidenceQueryParamsSchema = exports.UpdateEvidenceDTOSchema = exports.CreateEvidenceDTOSchema = exports.EvidenceMetadataSchema = exports.IntegrityStatus = exports.EvidenceStatus = void 0;
exports.isEvidenceID = isEvidenceID;
exports.isValidContentHash = isValidContentHash;
exports.isEvidence = isEvidence;
const zod_1 = require("zod");
// ============================================
// 證據狀態枚舉
// ============================================
var EvidenceStatus;
(function (EvidenceStatus) {
    EvidenceStatus["DRAFT"] = "draft";
    EvidenceStatus["SEALED"] = "sealed";
    EvidenceStatus["ANCHORED"] = "anchored";
    EvidenceStatus["ARCHIVED"] = "archived";
    EvidenceStatus["EXPIRED"] = "expired";
})(EvidenceStatus || (exports.EvidenceStatus = EvidenceStatus = {}));
var IntegrityStatus;
(function (IntegrityStatus) {
    IntegrityStatus["VALID"] = "valid";
    IntegrityStatus["TAMPERED"] = "tampered";
    IntegrityStatus["UNVERIFIED"] = "unverified";
    IntegrityStatus["VERIFICATION_FAILED"] = "verification_failed";
})(IntegrityStatus || (exports.IntegrityStatus = IntegrityStatus = {}));
// ============================================
// Zod Schema 驗證器（前後端共用）
// ============================================
exports.EvidenceMetadataSchema = zod_1.z.object({
    file_size: zod_1.z.number().optional(),
    file_name: zod_1.z.string().optional(),
    mime_type: zod_1.z.string().optional(),
    dimensions: zod_1.z.object({
        width: zod_1.z.number(),
        height: zod_1.z.number(),
    }).optional(),
    duration: zod_1.z.number().optional(),
    location: zod_1.z.object({
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180),
    }).optional(),
    device_info: zod_1.z.object({
        user_agent: zod_1.z.string(),
        ip_address: zod_1.z.string().optional(),
    }).optional(),
    custom_fields: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
});
exports.CreateEvidenceDTOSchema = zod_1.z.object({
    tag: zod_1.z.string().min(1).max(200),
    content: zod_1.z.string().min(1).max(10 * 1024 * 1024), // 10MB 限制
    content_type: zod_1.z.string().regex(/^[a-z]+\/[a-z0-9\-\+\.]+$/i),
    metadata: exports.EvidenceMetadataSchema.optional(),
    expires_in_days: zod_1.z.number().min(1).max(3650).optional(),
    auto_seal: zod_1.z.boolean().default(false),
});
exports.UpdateEvidenceDTOSchema = zod_1.z.object({
    tag: zod_1.z.string().min(1).max(200).optional(),
    metadata: exports.EvidenceMetadataSchema.partial().optional(),
    status: zod_1.z.nativeEnum(EvidenceStatus).optional(),
});
exports.EvidenceQueryParamsSchema = zod_1.z.object({
    user_id: zod_1.z.string().uuid().optional(),
    status: zod_1.z.union([
        zod_1.z.nativeEnum(EvidenceStatus),
        zod_1.z.array(zod_1.z.nativeEnum(EvidenceStatus)),
    ]).optional(),
    integrity_status: zod_1.z.nativeEnum(IntegrityStatus).optional(),
    created_after: zod_1.z.coerce.date().optional(),
    created_before: zod_1.z.coerce.date().optional(),
    tag_contains: zod_1.z.string().optional(),
    limit: zod_1.z.number().min(1).max(100).default(20),
    offset: zod_1.z.number().min(0).default(0),
    sort_by: zod_1.z.enum(['created_at', 'updated_at', 'tag']).default('created_at'),
    sort_order: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
// ============================================
// 型別守衛（Type Guards）
// ============================================
function isEvidenceID(value) {
    return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
function isValidContentHash(value) {
    return typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value);
}
function isEvidence(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const obj = value;
    return (typeof obj.id === 'string' &&
        typeof obj.user_id === 'string' &&
        typeof obj.tag === 'string' &&
        typeof obj.content === 'string' &&
        typeof obj.content_hash === 'string' &&
        Object.values(EvidenceStatus).includes(obj.status));
}
//# sourceMappingURL=evidence.types.js.map