import { NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<{
    success: boolean;
    data: any;
}> | NextResponse<{
    success: boolean;
    error: any;
    stack: any;
}>>;
//# sourceMappingURL=route.d.ts.map