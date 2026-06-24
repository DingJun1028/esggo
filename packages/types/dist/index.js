"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserSchema = exports.SharedESGReportSchema = exports.SharedUserSchema = exports.NCBDBProtocolEntitySchema = exports.OmniCoreDataEntitySchema = void 0;
const zod_1 = require("zod");
__exportStar(require("./AtomicFunction"), exports);
/**
 * OmniCoreDataEntity defines the base properties for all data entities
 * in the ESGGO system, ensuring Data Sovereignty as per OmniCore Constitution.
 * Write operations must automatically attach these properties.
 */
exports.OmniCoreDataEntitySchema = zod_1.z.object({
    uuid: zod_1.z.string().uuid().describe('Unique identifier for the entity.'),
    version: zod_1.z.number().int().nonnegative().describe('Version number, incremented on each significant update.'),
    createdAt: zod_1.z.string().datetime().describe('Timestamp of creation (ISO 8601 format).'),
    updatedAt: zod_1.z.string().datetime().describe('Timestamp of last update (ISO 8601 format).'),
});
/**
 * NCBDBProtocolEntity extends OmniCoreDataEntity, adding specific
 * inscription fields required by the NCBDB_PROTOCOL.md for all data writes.
 */
exports.NCBDBProtocolEntitySchema = exports.OmniCoreDataEntitySchema.extend({
    user_email: zod_1.z.string().email().describe('Email of the user who performed the operation.'),
    integrity_hash: zod_1.z.string().describe('Hash Lock corresponding to the original Supabase data for immutability verification.'),
});
exports.SharedUserSchema = exports.OmniCoreDataEntitySchema.extend({
    id: zod_1.z.string().describe('Keeping existing id for compatibility/primary key notion'),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(['admin', 'user', 'auditor']),
});
exports.SharedESGReportSchema = exports.NCBDBProtocolEntitySchema.extend({
    reportId: zod_1.z.string().describe('Keeping existing reportId'),
    companyName: zod_1.z.string(),
    year: zod_1.z.number().int(),
    status: zod_1.z.enum(['draft', 'submitted', 'verified']),
    score: zod_1.z.number(),
});
exports.AuthUserSchema = zod_1.z.object({
    id: zod_1.z.string(),
    email: zod_1.z.string().email().optional(),
    name: zod_1.z.string().optional(),
    picture: zod_1.z.string().optional(),
});
