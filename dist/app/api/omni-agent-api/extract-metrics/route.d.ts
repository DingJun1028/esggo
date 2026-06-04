import { NextResponse } from 'next/server';
export declare function POST(request: Request): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    confidence: number;
    metrics: {
        key: string;
        value: string | number;
        unit: string;
        gri: string;
    }[];
}>>;
//# sourceMappingURL=route.d.ts.map