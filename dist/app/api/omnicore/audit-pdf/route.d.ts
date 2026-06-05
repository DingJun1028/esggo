export declare const runtime = "nodejs";
export declare const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    message: string;
    details: {
        pdfParsedTextLength: number;
        hashLock: string;
        zkpSeal: string;
        aiExtraction: any;
        ncbdbSync: import("../../../../lib/ncbdb").NCBDBResponse<unknown>;
    };
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map