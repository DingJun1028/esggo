/**
 * Evidence tRPC Router
 * 端到端型別安全的 API 實作
 */
import { z } from 'zod';
export declare const evidenceRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../context").Context;
    meta: object;
    errorShape: {
        data: {
            zodError: z.typeToFlattenedError<any, string> | null;
            code: import("@trpc/server/rpc").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
            stack?: string;
        };
        message: string;
        code: import("@trpc/server/rpc").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    list: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: {
                data: {
                    zodError: z.typeToFlattenedError<any, string> | null;
                    code: import("@trpc/server/rpc").TRPC_ERROR_CODE_KEY;
                    httpStatus: number;
                    path?: string;
                    stack?: string;
                };
                message: string;
                code: import("@trpc/server/rpc").TRPC_ERROR_CODE_NUMBER;
            };
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: import("../context").Context;
        _input_in: {
            status?: import("@/src/shared/types").EvidenceStatus | import("@/src/shared/types").EvidenceStatus[] | undefined;
            user_id?: string | undefined;
            integrity_status?: import("@/src/shared/types").IntegrityStatus | undefined;
            created_after?: Date | undefined;
            created_before?: Date | undefined;
            tag_contains?: string | undefined;
            limit?: number | undefined;
            offset?: number | undefined;
            sort_by?: "created_at" | "updated_at" | "tag" | undefined;
            sort_order?: "asc" | "desc" | undefined;
        };
        _input_out: {
            limit: number;
            offset: number;
            sort_by: "created_at" | "updated_at" | "tag";
            sort_order: "asc" | "desc";
            status?: import("@/src/shared/types").EvidenceStatus | import("@/src/shared/types").EvidenceStatus[] | undefined;
            user_id?: string | undefined;
            integrity_status?: import("@/src/shared/types").IntegrityStatus | undefined;
            created_after?: Date | undefined;
            created_before?: Date | undefined;
            tag_contains?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, import("@/src/shared/types").PaginatedResult<import("@/src/shared/types").Evidence>>;
    create: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: {
                data: {
                    zodError: z.typeToFlattenedError<any, string> | null;
                    code: import("@trpc/server/rpc").TRPC_ERROR_CODE_KEY;
                    httpStatus: number;
                    path?: string;
                    stack?: string;
                };
                message: string;
                code: import("@trpc/server/rpc").TRPC_ERROR_CODE_NUMBER;
            };
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: import("../context").Context;
        _input_in: {
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
        };
        _input_out: {
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
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, import("@/src/shared/types").Evidence>;
    verify: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: {
                data: {
                    zodError: z.typeToFlattenedError<any, string> | null;
                    code: import("@trpc/server/rpc").TRPC_ERROR_CODE_KEY;
                    httpStatus: number;
                    path?: string;
                    stack?: string;
                };
                message: string;
                code: import("@trpc/server/rpc").TRPC_ERROR_CODE_NUMBER;
            };
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: import("../context").Context;
        _input_in: {
            id: string;
        };
        _input_out: {
            id: string;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, import("@/src/shared/types").VerificationResult>;
}>;
//# sourceMappingURL=evidence.router.d.ts.map