import { NextRequest, NextResponse } from 'next/server';
export declare function GET(request: NextRequest): Promise<NextResponse<{
    notes: {
        id: string;
        title: string;
        content: string;
        tags: string[];
        updatedAt: number;
    }[];
}>>;
export declare function POST(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    note: {
        id: string;
        title: any;
        content: any;
        tags: any;
        updatedAt: number;
    };
}>>;
//# sourceMappingURL=route.d.ts.map