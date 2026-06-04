import { NextRequest, NextResponse } from 'next/server';
export declare function POST(request: NextRequest): Promise<NextResponse<{
    success: boolean;
}>>;
export declare function GET(): Promise<NextResponse<{
    ok: boolean;
    logs: any[];
}>>;
//# sourceMappingURL=route.d.ts.map