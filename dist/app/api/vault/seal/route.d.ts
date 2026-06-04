import { NextRequest, NextResponse } from 'next/server';
export declare function POST(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    hashLock: string;
    uniqueName: string;
    secretId: string;
    sealedAt: string;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
export declare function GET(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    uniqueName: string;
    decrypted: any;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map