import { z } from 'zod';

/**
 * 🏛️ OmniSchemas: 5T Protocol Runtime Validation
 * ============================================
 * These schemas provide the "Zero Hallucination Proof" at the runtime level.
 * Every 'Atom' must pass these validations before being sealed.
 */

export const VirtueFingerprintSchema = z.object({
    wisdom: z.number().min(0).max(10),
    benevolence: z.number().min(0).max(10),
    courage: z.number().min(0).max(10),
    integrity: z.number().min(0).max(10),
    temperance: z.number().min(0).max(10),
    harmony: z.number().min(0).max(10),
    efficiency: z.number().optional(),
    moderation: z.number().optional(),
});

export const TraceableSchema = z.object({
    originHash: z.string(),
    genealogy: z.array(z.string()),
    sourceOrigin: z.string(),
    extractionMethod: z.enum(['OCR', 'IoT', 'Manual']).optional(),
});

export const LifecycleEventSchema = z.object({
    event: z.enum(['CREATED', 'UPDATED', 'VALIDATED', 'LOCKED', 'SEALED', 'EVOLVED']),
    actor: z.string(),
    time: z.number(),
    delta: z.record(z.string(), z.unknown()).optional(),
    reason: z.string().optional(),
});

export const TransparentSchema = z.object({
    algorithmId: z.string(),
    verificationProof: z.string(),
    formula: z.string(),
});

export const TastefulSchema = z.object({
    renderType: z.enum(['LiquidGlass', 'Hologram', 'Shattered']),
    interaction: z.enum(['Fluid', 'Haptic']),
    auraColor: z.string().startsWith('#'),
});

export const TrustworthySchema = z.object({
    isFrozen: z.boolean(),
    signerKey: z.string(),
    consensusTimestamp: z.number(),
    contentHash: z.string(),
});

export const TranscendentSchema = z.object({
    circleId: z.string(),
    interoperability: z.boolean(),
    // nextEvolution is a function, Zod can't easily validate function content but we can check if it's a function
    nextEvolution: z.function().optional(),
});

export const OmniSpaceTimeSchema = z.object({
    timestamp: z.object({
        iso: z.string().datetime(),
        epochNanoseconds: z.string(),
        timeZone: z.string(),
    }),
    location: z.object({
        geo: z.object({
            latitude: z.number(),
            longitude: z.number(),
            altitude: z.number(),
            accuracy: z.number(),
        }).optional(),
        local: z.object({
            beaconId: z.string(),
            relativeX: z.number(),
            relativeY: z.number(),
            relativeZ: z.number(),
        }).optional(),
        digital: z.object({
            serverRegion: z.string(),
            blockHeight: z.number().optional(),
        }).optional(),
    }),
    proof: z.object({
        method: z.enum(['GPS-Sign', 'WiFi-Triangulation', 'User-Biometric', 'Atomic-Sync', 'Hyper-Phase-Sync']),
        signature: z.string(),
    }),
    w: z.number().min(0).max(1).optional(),
});

export const OmniTagSchema = z.object({
    id: z.string(),
    semantic: z.string().startsWith('#'),
    dimension: z.string(),
    weight: z.number().min(0).max(1),
    spaceTime: OmniSpaceTimeSchema.optional(),
    category: z.enum(['Identity', 'Process', 'Asset', 'Insight']).optional(),
    reliability: z.number().min(0).max(1).optional(),
});

export const Protocol5TSchema = z.object({
    traceable: z.object({ status: z.enum(['pending', 'verified', 'failed']), timestamp: z.string(), evidence: z.string() }),
    trackable: z.object({ status: z.enum(['pending', 'verified', 'failed']), timestamp: z.string(), evidence: z.string() }),
    transparent: z.object({ status: z.enum(['pending', 'verified', 'failed']), timestamp: z.string(), evidence: z.string() }),
    tangible: z.object({ status: z.enum(['pending', 'verified', 'failed']), timestamp: z.string(), evidence: z.string() }),
    trustworthy: z.object({ status: z.enum(['pending', 'verified', 'failed']), timestamp: z.string(), evidence: z.string() }),
    sustainability: z.object({ status: z.enum(['pending', 'verified', 'failed']), timestamp: z.string(), evidence: z.string() }),
});

export const OmniAtomSchema = z.object({
    uuid: z.string().uuid(),
    version: z.union([z.string(), z.number()]),
    timestamp: z.number(),
    evidence: z.record(z.string(), z.unknown()),
    lifecycle_events: z.array(LifecycleEventSchema),
    data: z.unknown().optional(),
    isFrozen: z.boolean(),

    // 5T Dimensions
    originHash: z.string(),
    genealogy: z.array(z.string()),
    sourceOrigin: z.string(),

    algorithmId: z.string(),
    verificationProof: z.string(),
    formula: z.string(),

    renderType: z.enum(['LiquidGlass', 'Hologram', 'Shattered']),
    interaction: z.enum(['Fluid', 'Haptic']),
    auraColor: z.string().startsWith('#'),

    signerKey: z.string(),
    consensusTimestamp: z.number(),
    contentHash: z.string(),

    circleId: z.string(),
    interoperability: z.boolean(),

    // Metadata & Quality
    quality: z.number().min(0).max(10),
    domainRef: z.string(),
    tags: z.array(OmniTagSchema),
    spaceTime: OmniSpaceTimeSchema.optional(),
    payload: z.unknown(),
    signature: z.string(),
    hash_lock: z.string(),
    intent: z.string(),
    protocol: Protocol5TSchema.optional(), // Made optional as it's often added later
    lifecycle: z.array(LifecycleEventSchema),

    // v12.0 Pillars
    heritage: z.object({
        parentUuid: z.string().uuid().optional(),
        lineage: z.array(z.string()),
        version: z.number(),
        branches: z.array(z.string()).optional(),
        timestamp: z.string().optional(),
        signature: z.string().optional(),
    }).optional(),

    bridge: z.object({
        pastLink: z.string().optional(),
        futureIntent: z.string().optional(),
        causalEntropy: z.number().min(0).max(1).optional(),
    }).optional(),

    integration: z.object({
        sourcePlatform: z.string(),
        adapterRef: z.string(),
        mappingStatus: z.enum(['Perfect', 'Lossy', 'Partial', 'Seamless']),
        syncTimestamp: z.string().optional(),
    }).optional(),

    sustainability: z.object({
        longevityScore: z.number().min(0).max(100),
        impactHorizon: z.string(),
        evolutionPotential: z.number().min(0).max(1),
    }).optional(),

    hypercube: z.any().optional(),
    notarization: z.any().optional(),
});

export type TVirtueFingerprint = z.infer<typeof VirtueFingerprintSchema>;
export type TTraceable = z.infer<typeof TraceableSchema>;
export type TLifecycleEvent = z.infer<typeof LifecycleEventSchema>;
export type TTransparent = z.infer<typeof TransparentSchema>;
export type TTasteful = z.infer<typeof TastefulSchema>;
export type TTrustworthy = z.infer<typeof TrustworthySchema>;
export type TTranscendent = z.infer<typeof TranscendentSchema>;
export type TOmniSpaceTime = z.infer<typeof OmniSpaceTimeSchema>;
export type TOmniTag = z.infer<typeof OmniTagSchema>;
export type TOmniAtom<T = any> = z.infer<typeof OmniAtomSchema> & { payload: T, data?: T };
