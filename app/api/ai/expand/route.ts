import { NextRequest, NextResponse } from 'next/server';
import { esgResearchAgent } from '@/lib/ai/agentz0';
import { enterpriseRetriever } from '@/lib/ai/retrievers';
import { ai } from '@/lib/agents/genkit';

export const dynamic = 'force-dynamic';

/**
 * 🚀 RAG 檢索器：負責從向量資料庫撈取企業專屬知識
 */
async function retrieveEnterpriseKnowledge(companyId: string, query: string) {
    console.log(`[RAG] Retrieving knowledge for company: ${companyId}, query: ${query}`);
    
    try {
        // 1. 調用 Genkit Retriever 進行向量搜尋
        const docs = await ai.retrieve({
            retriever: enterpriseRetriever,
            query: query,
            options: {
                where: { companyId: companyId }
            }
        });

        if (!docs || docs.length === 0) return '無特定參考資料';

        // 2. 將檢索到的文本片段合併
        return docs.map(d => d.text).join('\n- ');
    } catch (error) {
        console.error('[RAG] Retrieval Error:', error);
        return '檢索失敗，將使用通用 ESG 知識進行擴寫。';
    }
}

export async function POST(req: NextRequest) {
    try {
        const { companyId, content, prompt, chapterName } = await req.json();

        // 1. 執行 RAG 檢索：去資料庫找相關的企業知識
        const knowledgeContext = await retrieveEnterpriseKnowledge(companyId || 'default', chapterName);

        // 2. Prompt 增強 (Augmented)：將知識庫內容注入
        const fullPrompt = `你是一位專業的 ESG 顧問 (OmniAgent)。現在正在撰寫永續報告書章節【${chapterName}】。
請根據以下「企業內部知識庫」的參考資料，以及使用者的「既有草稿」進行擴寫。
請直接輸出擴寫後的內容，不需要包含多餘的問候語。

自訂指示：${prompt || '請以專業、符合 GRI 準則的口吻進行擴寫與延伸。'}

【企業內部知識庫參考資料】：
${knowledgeContext || '無特定參考資料'}

既有草稿：
${content}
`;

        const encoder = new TextEncoder();

        // 建立 ReadableStream 來實現打字機流式輸出
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const responseStream = await esgResearchAgent.streamTask(fullPrompt);

                    for await (const chunk of responseStream) {
                        const text = typeof chunk === 'string' ? chunk : (chunk as any).text || '';
                        controller.enqueue(encoder.encode(text));
                    }
                } catch (error) {
                    console.error('[OmniAgent] Stream Error:', error);
                    controller.enqueue(encoder.encode('\n\n[系統提示：OmniAgent 生成過程中發生錯誤]'));
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
            },
        });
    } catch (error) {
        console.error('[OmniAgent] Request Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to connect to OmniAgent' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
