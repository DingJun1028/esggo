export declare const appRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("./context").Context;
    meta: object;
    errorShape: {
        data: {
            zodError: import("zod").typeToFlattenedError<any, string> | null;
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
    evidence: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: {
            data: {
                zodError: import("zod").typeToFlattenedError<any, string> | null;
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
                ctx: import("./context").Context;
                meta: object;
                errorShape: {
                    data: {
                        zodError: import("zod").typeToFlattenedError<any, string> | null;
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
            _ctx_out: import("./context").Context;
            _input_in: {
                status?: import("../../shared/types").EvidenceStatus | import("../../shared/types").EvidenceStatus[] | undefined;
                user_id?: string | undefined;
                integrity_status?: import("../../shared/types").IntegrityStatus | undefined;
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
                status?: import("../../shared/types").EvidenceStatus | import("../../shared/types").EvidenceStatus[] | undefined;
                user_id?: string | undefined;
                integrity_status?: import("../../shared/types").IntegrityStatus | undefined;
                created_after?: Date | undefined;
                created_before?: Date | undefined;
                tag_contains?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../../shared/types").PaginatedResult<import("../../shared/types").Evidence>>;
        create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./context").Context;
                meta: object;
                errorShape: {
                    data: {
                        zodError: import("zod").typeToFlattenedError<any, string> | null;
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
            _ctx_out: import("./context").Context;
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
        }, import("../../shared/types").Evidence>;
        verify: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./context").Context;
                meta: object;
                errorShape: {
                    data: {
                        zodError: import("zod").typeToFlattenedError<any, string> | null;
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
            _ctx_out: import("./context").Context;
            _input_in: {
                id: string;
            };
            _input_out: {
                id: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../../shared/types").VerificationResult>;
    }>;
    ucc: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: {
            data: {
                zodError: import("zod").typeToFlattenedError<any, string> | null;
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
        package: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./context").Context;
                meta: object;
                errorShape: {
                    data: {
                        zodError: import("zod").typeToFlattenedError<any, string> | null;
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
            _ctx_out: import("./context").Context;
            _input_in: {
                evidence_id: string;
                tags?: string[] | undefined;
                auto_extract?: boolean | undefined;
                analyze_content?: boolean | undefined;
                ocr_enabled?: boolean | undefined;
            };
            _input_out: {
                evidence_id: string;
                auto_extract: boolean;
                analyze_content: boolean;
                ocr_enabled: boolean;
                tags?: string[] | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../../shared/types").UCCPackage>;
    }>;
    omnispace: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: {
            data: {
                zodError: import("zod").typeToFlattenedError<any, string> | null;
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
        getTruthState: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./context").Context;
                meta: object;
                errorShape: {
                    data: {
                        zodError: import("zod").typeToFlattenedError<any, string> | null;
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
            _ctx_out: import("./context").Context;
            _input_in: {
                uuid: string;
            };
            _input_out: {
                uuid: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, unknown>;
        healCard: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./context").Context;
                meta: object;
                errorShape: {
                    data: {
                        zodError: import("zod").typeToFlattenedError<any, string> | null;
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
            _ctx_out: import("./context").Context;
            _input_in: {
                status: "todo" | "doing" | "done";
                name: string;
                attributes: string[];
                uuid: string;
                abilities: string[];
                lastUpdated: number;
            };
            _input_out: {
                status: "todo" | "doing" | "done";
                name: string;
                attributes: string[];
                uuid: string;
                abilities: string[];
                lastUpdated: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../../../lib/omni-space/global-healing").HealingResult>;
        sealDocument: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./context").Context;
                meta: object;
                errorShape: {
                    data: {
                        zodError: import("zod").typeToFlattenedError<any, string> | null;
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
            _ctx_out: import("./context").Context;
            _input_in: {
                documentId: string;
            };
            _input_out: {
                documentId: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            stdout?: string;
            stderr?: string;
            error?: string;
        }>;
    }>;
}>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=index.d.ts.map