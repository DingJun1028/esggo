import { NextResponse } from 'next/server';
import { queryKnowledgeBase } from '@/lib/agent/rag-engine';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { query, history } = body;

        if (!query) {
            return NextResponse.json({ error: '未提供檢索意圖 (query)' }, { status: 400 });
        }

        // 呼叫 RAG 引擎進行檢索與生成
        const result = await queryKnowledgeBase(query, history || []);

        return NextResponse.json({ 
            answer: result.answer, 
            sources: result.sources 
        });
    } catch (error: unknown) {
        console.error('[RAG Query API] 錯誤發生震盪:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}