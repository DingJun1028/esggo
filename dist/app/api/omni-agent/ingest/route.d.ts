import { NextResponse } from 'next/server';
export declare function POST(req: Request): Promise<NextResponse<{
    success: boolean;
    message: string;
    chunks: number;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map