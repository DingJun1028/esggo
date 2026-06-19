import { NextResponse } from "next/server";
import { ZodSchema } from "zod";

/**
 * 經過驗證的處理函式型別
 * B 泛型代表 Request Body 型別，Q 泛型代表 URL Query 型別
 */
type ValidatedHandler<B, Q> = (
    request: Request,
    context: {
        params: Record<string, string>;
        validatedBody: B;
        validatedQuery: Q;
    }
) => Promise<NextResponse> | NextResponse;

/**
 * API 路由驗證高階函式 (HOF)
 * @param schemas 包含 body 和 query 的 Zod Schemas
 * @param handler 實際執行商業邏輯的處理函式
 */
export function withValidation<B = unknown, Q = unknown>(
    schemas: { body?: ZodSchema<B>; query?: ZodSchema<Q> },
    handler: ValidatedHandler<B, Q>
) {
    return async (request: Request, context: { params: Promise<Record<string, string>> }) => {
        const params = (await context.params) || {};
        const resolvedContext = { ...context, params };
        let validatedBody = {} as B;
        let validatedQuery = {} as Q;

        // 1. 驗證 URL Query 參數
        if (schemas.query) {
            const { searchParams } = new URL(request.url);
            const queryObj = Object.fromEntries(searchParams.entries());

            const queryResult = schemas.query.safeParse(queryObj);
            if (!queryResult.success) {
                return NextResponse.json(
                    {
                        error: "Query 參數驗證失敗",
                        details: queryResult.error.flatten().fieldErrors,
                    },
                    { status: 400 }
                );
            }
            validatedQuery = queryResult.data;
        }

        // 2. 驗證 Request Body (僅在設定了 body schema 且為 POST/PUT/PATCH 時)
        if (schemas.body && ["POST", "PUT", "PATCH"].includes(request.method)) {
            try {
                const body = await request.json();
                const bodyResult = schemas.body.safeParse(body);
                if (!bodyResult.success) {
                    return NextResponse.json(
                        {
                            error: "Request Body 驗證失敗",
                            details: bodyResult.error.flatten().fieldErrors,
                        },
                        { status: 400 }
                    );
                }
                validatedBody = bodyResult.data;
            } catch (error) {
                return NextResponse.json({ error: "無效的請求格式 (Invalid JSON)" }, { status: 400 });
            }
        }

        // 3. 驗證成功，將結果傳遞給 Handler
        return handler(request, { ...resolvedContext, validatedBody, validatedQuery });
    };
}