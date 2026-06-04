import { z } from 'zod';
export const AtomicFunctionSchema = z.function(z.tuple([
    z.object({
        context: z.object({
            requestId: z.string(),
            timestamp: z.number(),
            actor: z.string(),
            environment: z.enum(['development', 'staging', 'production']),
            traceId: z.string().optional()
        }),
        payload: z.unknown()
    })
]))
    .returns(z.object({
    success: z.boolean(),
    data: z.unknown().optional(),
    error: z.instanceof(Error).optional(),
    metadata: z.object({
        executionTime: z.number(),
        version: z.string()
    }).optional()
}));
// Zod Schema 驗證：萬能元件心核
export const OmniComponentHeartSchema = z.object({
    omniSignature: z.string().regex(/^0x[a-fA-F0-9]+$/, "Must be a valid hex signature"),
    resonanceState: z.number().min(0).max(1),
    omniClass: z.enum(['OmniMemory', 'OmniRune', 'OmniAgent', 'OmniTag', 'OmniLibrary', 'OmniGeneral']),
    coreContext: z.object({
        requestId: z.string(),
        timestamp: z.number(),
        actor: z.string(),
        environment: z.enum(['development', 'staging', 'production']),
        traceId: z.string().optional()
    }),
    fiveTState: z.object({
        truthTraceable: z.boolean(),
        goodnessTransparent: z.boolean(),
        beautyTangible: z.boolean(),
        trustTrustworthy: z.boolean(),
        transferfulTrackable: z.boolean()
    }).optional(),
    zkpSeal: z.object({
        commitment: z.string(),
        blindingFactor: z.string().optional(),
        sealedAt: z.number()
    }).optional()
});
//# sourceMappingURL=AtomicFunction.js.map