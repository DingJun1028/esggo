export declare const runtime = "nodejs";
export declare const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
export declare function POST(request: Request): Promise<NextResponse<{
    ok: boolean;
    error: string;
}> | NextResponse<{
    ok: boolean;
    execution: {
        id: string;
        taskId: any;
        status: string;
        modelName: string;
        auditLogId: string;
        createdAt: string;
    };
    artifact: {
        id: string;
        taskId: any;
        version: number;
        content: string;
        reviewStatus: string;
        createdAt: string;
    };
}>>;
//# sourceMappingURL=route.d.ts.map