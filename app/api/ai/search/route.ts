import { NextRequest, NextResponse } from 'next/server';
import { enterpriseRetriever } from '@/lib/ai/retrievers';
import { ai } from '@/lib/agents/genkit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


/**
 * 🚀 全域知識檢索 API (Global Search)
 * 透過 Genkit Vector Search 從企業智庫中搜尋最相關的知識片段。
 */
export async function POST(req: NextRequest) {
    try {
        const { query, companyId, limit = 5 } = await req.json();

        if (!query) {
            return NextResponse.json({ error: '請提供搜尋關鍵字' }, { status: 400 });
        }

        console.log(`[Search] Query: "${query}" for company: ${companyId}`);

        // 執行向量搜尋
        const docs = await ai.retrieve({
            retriever: enterpriseRetriever,
            query: query,
            options: {
                where: { companyId: companyId || 'default' },
                limit: limit
            }
        });

        const results = docs.map(doc => ({
            text: doc.text,
            title: (doc.metadata as any)?.title || '未知文件',
            docId: (doc.metadata as any)?.docId,
            score: (doc as any).score // 部分檢索器支援分數
        }));

        return NextResponse.json({
            success: true,
            results: results
        });

    } catch (error) {
        console.error('[Search API] Error:', error);
        return NextResponse.json({ 
            error: '檢索過程中發生錯誤',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
