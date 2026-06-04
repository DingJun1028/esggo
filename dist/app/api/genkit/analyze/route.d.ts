export declare const runtime = "nodejs";
export declare const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
export declare function POST(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    error: import("zod").typeToFlattenedError<{
        content: string;
        category?: "E" | "S" | "G" | undefined;
        griReference?: string | undefined;
        language?: "zh-TW" | "en" | undefined;
    }, string>;
}> | NextResponse<{
    success: boolean;
    data: {
        formula: string;
        compliance: {
            recommendations: string[];
            score: number;
            gaps: string[];
        };
        summary: string;
        greenwashingRisks: {
            phrase: string;
            riskLevel: "medium" | "high" | "low";
            suggestion: string;
        }[];
        griAlignment: string[];
    } & {
        hashLock: string;
        vaultId: string;
    };
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map