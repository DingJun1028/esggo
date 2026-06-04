import { NextResponse } from 'next/server';
export declare function POST(request: Request): Promise<NextResponse<{
    answer: string;
    sources: any;
}> | NextResponse<{
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map