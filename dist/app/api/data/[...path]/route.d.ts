import { NextRequest, NextResponse } from "next/server";
export declare function GET(req: NextRequest, { params }: {
    params: Promise<{
        path: string[];
    }>;
}): Promise<NextResponse<unknown>>;
export declare function POST(req: NextRequest, { params }: {
    params: Promise<{
        path: string[];
    }>;
}): Promise<NextResponse<unknown>>;
export declare function PUT(req: NextRequest, { params }: {
    params: Promise<{
        path: string[];
    }>;
}): Promise<NextResponse<unknown>>;
export declare function DELETE(req: NextRequest, { params }: {
    params: Promise<{
        path: string[];
    }>;
}): Promise<NextResponse<unknown>>;
//# sourceMappingURL=route.d.ts.map