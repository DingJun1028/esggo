import { NextResponse } from 'next/server';
import { queryKnowledgeBase } from '@/lib/agent/rag-engine';

export async function POST(request: Request) {
    try {
        const { query, history } = await request.json();

        // 正式串接底層的 RAG 知識庫引擎，並傳遞對話歷史 (Semantic Memory)
        const { answer, sources } = await queryKnowledgeBase(query, history || []);

        return NextResponse.json({ answer, sources });
    } catch (error: any) {
        console.error('[RAG API] 錯誤發生震盪:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}