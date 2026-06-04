import { NextRequest, NextResponse } from 'next/server';
export declare const runtime = "nodejs";
export declare const dynamic = "force-dynamic";
/**
 * 🚀 全域知識檢索 API (Global Search)
 * 透過 Genkit Vector Search 從企業智庫中搜尋最相關的知識片段。
 */
export declare function POST(req: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    results: {
        text: string;
        title: any;
        docId: any;
        score: any;
    }[];
}>>;
//# sourceMappingURL=route.d.ts.map