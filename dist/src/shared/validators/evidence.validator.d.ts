import { z } from 'zod';
import { EvidenceStatus, IntegrityStatus } from '../types/evidence.types';
export declare const EvidenceMetadataSchema: z.ZodObject<{
    file_size: z.ZodOptional<z.ZodNumber>;
    file_name: z.ZodOptional<z.ZodString>;
    mime_type: z.ZodOptional<z.ZodString>;
    dimensions: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
    }, {
        width: number;
        height: number;
    }>>;
    duration: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        latitude: number;
        longitude: number;
    }, {
        latitude: number;
        longitude: number;
    }>>;
    device_info: z.ZodOptional<z.ZodObject<{
        user_agent: z.ZodString;
        ip_address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        user_agent: string;
        ip_address?: string | undefined;
    }, {
        user_agent: string;
        ip_address?: string | undefined;
    }>>;
    custom_fields: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    file_size?: number | undefined;
    file_name?: string | undefined;
    mime_type?: string | undefined;
    dimensions?: {
        width: number;
        height: number;
    } | undefined;
    duration?: number | undefined;
    location?: {
        latitude: number;
        longitude: number;
    } | undefined;
    device_info?: {
        user_agent: string;
        ip_address?: string | undefined;
    } | undefined;
    custom_fields?: Record<string, unknown> | undefined;
}, {
    file_size?: number | undefined;
    file_name?: string | undefined;
    mime_type?: string | undefined;
    dimensions?: {
        width: number;
        height: number;
    } | undefined;
    duration?: number | undefined;
    location?: {
        latitude: number;
        longitude: number;
    } | undefined;
    device_info?: {
        user_agent: string;
        ip_address?: string | undefined;
    } | undefined;
    custom_fields?: Record<string, unknown> | undefined;
}>;
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
        }, "strip", z.ZodTypeAny, {
            width: number;
            height: number;
        }, {
            width: number;
            height: number;
        }>>;
        duration: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            latitude: number;
            longitude: number;
        }, {
            latitude: number;
            longitude: number;
        }>>;
        device_info: z.ZodOptional<z.ZodObject<{
            user_agent: z.ZodString;
            ip_address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            user_agent: string;
            ip_address?: string | undefined;
        }, {
            user_agent: string;
            ip_address?: string | undefined;
        }>>;
        custom_fields: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        file_size?: number | undefined;
        file_name?: string | undefined;
        mime_type?: string | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        duration?: number | undefined;
        location?: {
            latitude: number;
            longitude: number;
        } | undefined;
        device_info?: {
            user_agent: string;
            ip_address?: string | undefined;
        } | undefined;
        custom_fields?: Record<string, unknown> | undefined;
    }, {
        file_size?: number | undefined;
        file_name?: string | undefined;
        mime_type?: string | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        duration?: number | undefined;
        location?: {
            latitude: number;
            longitude: number;
        } | undefined;
        device_info?: {
            user_agent: string;
            ip_address?: string | undefined;
        } | undefined;
        custom_fields?: Record<string, unknown> | undefined;
    }>>;
    expires_in_days: z.ZodOptional<z.ZodNumber>;
    auto_seal: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    tag: string;
    content: string;
    content_type: string;
    auto_seal: boolean;
    metadata?: {
        file_size?: number | undefined;
        file_name?: string | undefined;
        mime_type?: string | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        duration?: number | undefined;
        location?: {
            latitude: number;
            longitude: number;
        } | undefined;
        device_info?: {
            user_agent: string;
            ip_address?: string | undefined;
        } | undefined;
        custom_fields?: Record<string, unknown> | undefined;
    } | undefined;
    expires_in_days?: number | undefined;
}, {
    tag: string;
    content: string;
    content_type: string;
    metadata?: {
        file_size?: number | undefined;
        file_name?: string | undefined;
        mime_type?: string | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        duration?: number | undefined;
        location?: {
            latitude: number;
            longitude: number;
        } | undefined;
        device_info?: {
            user_agent: string;
            ip_address?: string | undefined;
        } | undefined;
        custom_fields?: Record<string, unknown> | undefined;
    } | undefined;
    expires_in_days?: number | undefined;
    auto_seal?: boolean | undefined;
}>;
export declare const UpdateEvidenceDTOSchema: z.ZodObject<{
    tag: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        file_size: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        file_name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        mime_type: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        dimensions: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            width: number;
            height: number;
        }, {
            width: number;
            height: number;
        }>>>;
        duration: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        location: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            latitude: number;
            longitude: number;
        }, {
            latitude: number;
            longitude: number;
        }>>>;
        device_info: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            user_agent: z.ZodString;
            ip_address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            user_agent: string;
            ip_address?: string | undefined;
        }, {
            user_agent: string;
            ip_address?: string | undefined;
        }>>>;
        custom_fields: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, "strip", z.ZodTypeAny, {
        file_size?: number | undefined;
        file_name?: string | undefined;
        mime_type?: string | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        duration?: number | undefined;
        location?: {
            latitude: number;
            longitude: number;
        } | undefined;
        device_info?: {
            user_agent: string;
            ip_address?: string | undefined;
        } | undefined;
        custom_fields?: Record<string, unknown> | undefined;
    }, {
        file_size?: number | undefined;
        file_name?: string | undefined;
        mime_type?: string | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        duration?: number | undefined;
        location?: {
            latitude: number;
            longitude: number;
        } | undefined;
        device_info?: {
            user_agent: string;
            ip_address?: string | undefined;
        } | undefined;
        custom_fields?: Record<string, unknown> | undefined;
    }>>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof EvidenceStatus>>;
}, "strip", z.ZodTypeAny, {
    tag?: string | undefined;
    status?: EvidenceStatus | undefined;
    metadata?: {
        file_size?: number | undefined;
        file_name?: string | undefined;
        mime_type?: string | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        duration?: number | undefined;
        location?: {
            latitude: number;
            longitude: number;
        } | undefined;
        device_info?: {
            user_agent: string;
            ip_address?: string | undefined;
        } | undefined;
        custom_fields?: Record<string, unknown> | undefined;
    } | undefined;
}, {
    tag?: string | undefined;
    status?: EvidenceStatus | undefined;
    metadata?: {
        file_size?: number | undefined;
        file_name?: string | undefined;
        mime_type?: string | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        duration?: number | undefined;
        location?: {
            latitude: number;
            longitude: number;
        } | undefined;
        device_info?: {
            user_agent: string;
            ip_address?: string | undefined;
        } | undefined;
        custom_fields?: Record<string, unknown> | undefined;
    } | undefined;
}>;
export declare const EvidenceQueryParamsSchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodUnion<[z.ZodNativeEnum<typeof EvidenceStatus>, z.ZodArray<z.ZodNativeEnum<typeof EvidenceStatus>, "many">]>>;
    integrity_status: z.ZodOptional<z.ZodNativeEnum<typeof IntegrityStatus>>;
    created_after: z.ZodOptional<z.ZodDate>;
    created_before: z.ZodOptional<z.ZodDate>;
    tag_contains: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["created_at", "updated_at", "tag"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    sort_by: "created_at" | "updated_at" | "tag";
    sort_order: "asc" | "desc";
    status?: EvidenceStatus | EvidenceStatus[] | undefined;
    user_id?: string | undefined;
    integrity_status?: IntegrityStatus | undefined;
    created_after?: Date | undefined;
    created_before?: Date | undefined;
    tag_contains?: string | undefined;
}, {
    status?: EvidenceStatus | EvidenceStatus[] | undefined;
    user_id?: string | undefined;
    integrity_status?: IntegrityStatus | undefined;
    created_after?: Date | undefined;
    created_before?: Date | undefined;
    tag_contains?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    sort_by?: "created_at" | "updated_at" | "tag" | undefined;
    sort_order?: "asc" | "desc" | undefined;
}>;
//# sourceMappingURL=evidence.validator.d.ts.map