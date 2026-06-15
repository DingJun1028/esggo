"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniComponentHeartSchema = exports.AtomicFunctionSchema = void 0;
const zod_1 = require("zod");
exports.AtomicFunctionSchema = zod_1.z.function(zod_1.z.tuple([
    zod_1.z.object({
        context: zod_1.z.object({
            requestId: zod_1.z.string(),
            timestamp: zod_1.z.number(),
            actor: zod_1.z.string(),
            environment: zod_1.z.enum(['development', 'staging', 'production']),
            traceId: zod_1.z.string().optional()
        }),
        payload: zod_1.z.unknown()
    })
]))
    .returns(zod_1.z.object({
    success: zod_1.z.boolean(),
    data: zod_1.z.unknown().optional(),
    error: zod_1.z.instanceof(Error).optional(),
    metadata: zod_1.z.object({
        executionTime: zod_1.z.number(),
        version: zod_1.z.string()
    }).optional()
}));
// Zod Schema 驗證：萬能元件心核
exports.OmniComponentHeartSchema = zod_1.z.object({
    omniSignature: zod_1.z.string().regex(/^0x[a-fA-F0-9]+$/, "Must be a valid hex signature"),
    resonanceState: zod_1.z.number().min(0).max(1),
    omniClass: zod_1.z.enum(['OmniMemory', 'OmniRune', 'OmniAgent', 'OmniTag', 'OmniLibrary', 'OmniGeneral']),
    coreContext: zod_1.z.object({
        requestId: zod_1.z.string(),
        timestamp: zod_1.z.number(),
        actor: zod_1.z.string(),
        environment: zod_1.z.enum(['development', 'staging', 'production']),
        traceId: zod_1.z.string().optional()
    }),
    fiveTState: zod_1.z.object({
        truthTraceable: zod_1.z.boolean(),
        goodnessTransparent: zod_1.z.boolean(),
        beautyTangible: zod_1.z.boolean(),
        trustTrustworthy: zod_1.z.boolean(),
        transferfulTrackable: zod_1.z.boolean()
    }).optional(),
    zkpSeal: zod_1.z.object({
        commitment: zod_1.z.string(),
        blindingFactor: zod_1.z.string().optional(),
        sealedAt: zod_1.z.number()
    }).optional()
});
