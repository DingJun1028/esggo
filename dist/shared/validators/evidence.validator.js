"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvidenceQueryParamsSchema = exports.UpdateEvidenceDTOSchema = exports.CreateEvidenceDTOSchema = exports.EvidenceMetadataSchema = void 0;
const zod_1 = require("zod");
const evidence_types_1 = require("../types/evidence.types");
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
    content: zod_1.z.string().min(1).max(10 * 1024 * 1024),
    content_type: zod_1.z.string().regex(/^[a-z]+\/[a-z0-9\-\+\.]+$/i),
    metadata: exports.EvidenceMetadataSchema.optional(),
    expires_in_days: zod_1.z.number().min(1).max(3650).optional(),
    auto_seal: zod_1.z.boolean().default(false),
});
exports.UpdateEvidenceDTOSchema = zod_1.z.object({
    tag: zod_1.z.string().min(1).max(200).optional(),
    metadata: exports.EvidenceMetadataSchema.partial().optional(),
    status: zod_1.z.nativeEnum(evidence_types_1.EvidenceStatus).optional(),
});
exports.EvidenceQueryParamsSchema = zod_1.z.object({
    user_id: zod_1.z.string().uuid().optional(),
    status: zod_1.z.union([
        zod_1.z.nativeEnum(evidence_types_1.EvidenceStatus),
        zod_1.z.array(zod_1.z.nativeEnum(evidence_types_1.EvidenceStatus)),
    ]).optional(),
    integrity_status: zod_1.z.nativeEnum(evidence_types_1.IntegrityStatus).optional(),
    created_after: zod_1.z.coerce.date().optional(),
    created_before: zod_1.z.coerce.date().optional(),
    tag_contains: zod_1.z.string().optional(),
    limit: zod_1.z.number().min(1).max(100).default(20),
    offset: zod_1.z.number().min(0).default(0),
    sort_by: zod_1.z.enum(['created_at', 'updated_at', 'tag']).default('created_at'),
    sort_order: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=evidence.validator.js.map