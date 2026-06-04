import { z } from 'zod';
import { EvidenceStatus, IntegrityStatus } from '../types/evidence.types';
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
//# sourceMappingURL=evidence.validator.d.ts.map