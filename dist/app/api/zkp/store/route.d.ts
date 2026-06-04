import { NextResponse } from 'next/server';
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    data: any;
    message: string;
}> | NextResponse<{
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map