import { NextRequest, NextResponse } from 'next/server';
export declare function POST(req: NextRequest, { params }: {
    params: Promise<{
        artifactId: string;
    }>;
}): Promise<NextResponse<{
    artifactId: string;
    reviewStatus: string;
    promotedAt: string;
    hashLock: string;
    ok: boolean;
}> | NextResponse<{
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map