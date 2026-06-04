/**
 * 證據核心型別定義
 * 前後端共享，確保型別一致性
 */
import { z } from 'zod';
export type EvidenceID = string & {
    readonly __brand: 'EvidenceID';
};
export type UserID = string & {
    readonly __brand: 'UserID';
};
export type ContentHash = string & {
    readonly __brand: 'ContentHash';
};
export type BlockchainTxHash = string & {
    readonly __brand: 'BlockchainTxHash';
};
export declare enum EvidenceStatus {
    DRAFT = "draft",
    SEALED = "sealed",
    ANCHORED = "anchored",
    ARCHIVED = "archived",
    EXPIRED = "expired"
}
export declare enum IntegrityStatus {
    VALID = "valid",
    TAMPERED = "tampered",
    UNVERIFIED = "unverified",
    VERIFICATION_FAILED = "verification_failed"
}
export interface Evidence {
    id: EvidenceID;
    user_id: UserID;
    tag: string;
    content: string;
    content_type: string;
    content_hash: ContentHash;
    metadata?: EvidenceMetadata;
    status: EvidenceStatus;
    integrity_status: IntegrityStatus;
    blockchain_tx?: BlockchainTxHash;
    created_at: Date;
    updated_at: Date;
    sealed_at?: Date;
    expires_at?: Date;
    archived_at?: Date;
}
export interface EvidenceMetadata {
    file_size?: number;
    file_name?: string;
    mime_type?: string;
    dimensions?: {
        width: number;
        height: number;
    };
    duration?: number;
    location?: {
        latitude: number;
        longitude: number;
    };
    device_info?: {
        user_agent: string;
        ip_address?: string;
    };
    custom_fields?: Record<string, unknown>;
}
export interface CreateEvidenceDTO {
    tag: string;
    content: string;
    content_type: string;
    metadata?: EvidenceMetadata;
    expires_in_days?: number;
    auto_seal?: boolean;
}
export interface UpdateEvidenceDTO {
    tag?: string;
    metadata?: Partial<EvidenceMetadata>;
    status?: EvidenceStatus;
}
export interface VerificationResult {
    evidence_id: EvidenceID;
    is_valid: boolean;
    integrity_status: IntegrityStatus;
    content_hash_match: boolean;
    blockchain_verified: boolean;
    verified_at: Date;
    details: {
        stored_hash: ContentHash;
        computed_hash: ContentHash;
        blockchain_tx?: BlockchainTxHash;
        blockchain_timestamp?: Date;
        tamper_detected_fields?: string[];
    };
}
export interface EvidenceQueryParams {
    user_id?: UserID;
    status?: EvidenceStatus | EvidenceStatus[];
    integrity_status?: IntegrityStatus;
    created_after?: Date;
    created_before?: Date;
    tag_contains?: string;
    limit?: number;
    offset?: number;
    sort_by?: 'created_at' | 'updated_at' | 'tag';
    sort_order?: 'asc' | 'desc';
}
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        has_more: boolean;
    };
}
export declare const EvidenceMetadataSchema: z.ZodObject<{
    file_size: z.ZodOptional<z.ZodNumber>;
    file_name: z.ZodOptional<z.ZodString>;
    mime_type: z.ZodOptional<z.ZodString>;
    dimensions: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strip>>;
    duration: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
    }, z.core.$strip>>;
    device_info: z.ZodOptional<z.ZodObject<{
        user_agent: z.ZodString;
        ip_address: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    custom_fields: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const CreateEvidenceDTOSchema: z.ZodObject<{
    tag: z.ZodString;
    content: z.ZodString;
    content_type: z.ZodString;
    metadata: z.ZodOptional<z.ZodObject<{
        file_size: z.ZodOptional<z.ZodNumber>;
        file_name: z.ZodOptional<z.ZodString>;
        mime_type: z.ZodOptional<z.ZodString>;
        dimensions: z.ZodOptional<z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strip>>;
        duration: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, z.core.$strip>>;
        device_info: z.ZodOptional<z.ZodObject<{
            user_agent: z.ZodString;
            ip_address: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        custom_fields: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    expires_in_days: z.ZodOptional<z.ZodNumber>;
    auto_seal: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const UpdateEvidenceDTOSchema: z.ZodObject<{
    tag: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        file_size: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        file_name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        mime_type: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        dimensions: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strip>>>;
        duration: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        location: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, z.core.$strip>>>;
        device_info: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            user_agent: z.ZodString;
            ip_address: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        custom_fields: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>;
    status: z.ZodOptional<z.ZodEnum<typeof EvidenceStatus>>;
}, z.core.$strip>;
export declare const EvidenceQueryParamsSchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<typeof EvidenceStatus>, z.ZodArray<z.ZodEnum<typeof EvidenceStatus>>]>>;
    integrity_status: z.ZodOptional<z.ZodEnum<typeof IntegrityStatus>>;
    created_after: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    created_before: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    tag_contains: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<{
        created_at: "created_at";
        updated_at: "updated_at";
        tag: "tag";
    }>>;
    sort_order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare function isEvidenceID(value: unknown): value is EvidenceID;
export declare function isValidContentHash(value: unknown): value is ContentHash;
export declare function isEvidence(value: unknown): value is Evidence;
//# sourceMappingURL=evidence.types.d.ts.map