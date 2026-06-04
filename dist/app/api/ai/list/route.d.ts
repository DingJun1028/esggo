export declare const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import '@/lib/firebase-admin';
export declare const dynamic = "force-dynamic";
/**
 * 🚀 獲取企業已入庫的文件列表
 * 此 API 會從 enterprise_knowledge 集合中按 docId 分組，彙整出檔案名稱與區塊數量。
 */
export declare function GET(req: NextRequest): Promise<NextResponse<{
    success: boolean;
    files: {
        title: string;
        chunks: number;
        createdAt: string;
    }[];
}> | NextResponse<{
    success: boolean;
    error: string;
    details: string;
}>>;
//# sourceMappingURL=route.d.ts.map