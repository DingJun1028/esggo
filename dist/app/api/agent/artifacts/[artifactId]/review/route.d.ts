import { NextRequest, NextResponse } from 'next/server';
export declare function POST(req: NextRequest, { params }: {
    params: Promise<{
        artifactId: string;
    }>;
}): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    artifactId: string;
    reviewStatus: string;
    reviewNote: any;
    reviewerId: any;
    reviewedAt: string;
    ok: boolean;
}>>;
//# sourceMappingURL=route.d.ts.map