import { NextRequest, NextResponse } from 'next/server';
export declare function GET(request: NextRequest, { params }: {
    params: Promise<{
        module: string;
    }>;
}): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    data: any[];
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
export declare function POST(request: NextRequest, { params }: {
    params: Promise<{
        module: string;
    }>;
}): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    data: any;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map