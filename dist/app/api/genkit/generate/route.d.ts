export declare const runtime = "nodejs";
export declare const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
export declare function POST(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    data: {
        risks: Array<{
            phrase: string;
            riskLevel: string;
            suggestion: string;
        }>;
        overallRisk: "low" | "medium" | "high";
        hashLock: string;
    };
}> | NextResponse<{
    success: boolean;
    error: import("zod").typeToFlattenedError<{
        metrics: Record<string, string | number>;
        chapter: string;
        persona?: "compliance" | "harmony" | "innovation" | undefined;
        wordCount?: number | undefined;
    }, string>;
}> | NextResponse<{
    success: boolean;
    data: {
        content: string;
        keyPoints: string[];
        griIndicators: string[];
        evidenceRequired: string[];
    } & {
        hashLock: string;
    };
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map