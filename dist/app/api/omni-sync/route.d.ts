import { NextResponse } from 'next/server';
export declare function POST(): Promise<NextResponse<{
    processed: number;
    succeeded: number;
    failed: number;
    success: boolean;
    message: string;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map