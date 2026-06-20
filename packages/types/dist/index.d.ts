import { z } from 'zod';
export * from './AtomicFunction';
export type { OmniComponentHeart } from './AtomicFunction';
/**
 * OmniCoreDataEntity defines the base properties for all data entities
 * in the ESGGO system, ensuring Data Sovereignty as per OmniCore Constitution.
 * Write operations must automatically attach these properties.
 */
export declare const OmniCoreDataEntitySchema: z.ZodObject<{
    uuid: z.ZodString;
    version: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    uuid: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}, {
    uuid: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}>;
export type OmniCoreDataEntity = z.infer<typeof OmniCoreDataEntitySchema>;
/**
 * NCBDBProtocolEntity extends OmniCoreDataEntity, adding specific
 * inscription fields required by the NCBDB_PROTOCOL.md for all data writes.
 */
export declare const NCBDBProtocolEntitySchema: z.ZodObject<{
    uuid: z.ZodString;
    version: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    user_email: z.ZodString;
    integrity_hash: z.ZodString;
}, "strip", z.ZodTypeAny, {
    uuid: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    user_email: string;
    integrity_hash: string;
}, {
    uuid: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    user_email: string;
    integrity_hash: string;
}>;
export type NCBDBProtocolEntity = z.infer<typeof NCBDBProtocolEntitySchema>;
export declare const SharedUserSchema: z.ZodObject<{
    uuid: z.ZodString;
    version: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<["admin", "user", "auditor"]>;
}, "strip", z.ZodTypeAny, {
    uuid: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    email: string;
    role: "admin" | "user" | "auditor";
}, {
    uuid: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    email: string;
    role: "admin" | "user" | "auditor";
}>;
export type SharedUser = z.infer<typeof SharedUserSchema>;
export declare const SharedESGReportSchema: z.ZodObject<{
    uuid: z.ZodString;
    version: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    user_email: z.ZodString;
    integrity_hash: z.ZodString;
} & {
    reportId: z.ZodString;
    companyName: z.ZodString;
    year: z.ZodNumber;
    status: z.ZodEnum<["draft", "submitted", "verified"]>;
    score: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    uuid: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    status: "draft" | "submitted" | "verified";
    user_email: string;
    integrity_hash: string;
    reportId: string;
    companyName: string;
    year: number;
    score: number;
}, {
    uuid: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    status: "draft" | "submitted" | "verified";
    user_email: string;
    integrity_hash: string;
    reportId: string;
    companyName: string;
    year: number;
    score: number;
}>;
export type SharedESGReport = z.infer<typeof SharedESGReportSchema>;
export declare const AuthUserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    picture: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name?: string | undefined;
    email?: string | undefined;
    picture?: string | undefined;
}, {
    id: string;
    name?: string | undefined;
    email?: string | undefined;
    picture?: string | undefined;
}>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
