import { NextRequest, NextResponse } from 'next/server';
import { indexKnowledgeDocument } from '@/lib/ai/retrievers';
import * as pdfParse from 'pdf-parse';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const companyId = (formData.get('companyId') as string) || 'default';

        if (!file) {
            return NextResponse.json({ error: '請提供要上傳的檔案' }, { status: 400 });
        }

        // 1. 將上傳的 File 物件轉為 Buffer 並交給 pdf-parse 解析
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // 解決 pdf-parse 在某些環境下的導入問題
        const parse = (pdfParse as any).default || pdfParse;
        const pdfData = await parse(buffer);

        // 取得純文字並過濾掉多餘的空白
        const rawText = pdfData.text.replace(/\n\s*\n/g, '\n').trim();

        // 2. 文字切塊 (Chunking) 策略：滑動視窗 (Sliding Window)
        const CHUNK_SIZE = 1000;
        const CHUNK_OVERLAP = 200;
        const chunks: string[] = [];

        for (let i = 0; i < rawText.length; i += (CHUNK_SIZE - CHUNK_OVERLAP)) {
            chunks.push(rawText.substring(i, i + CHUNK_SIZE));
            if (i + CHUNK_SIZE >= rawText.length) break;
        }

        const docId = crypto.randomUUID();
        const title = file.name;

        // 3. 寫入 Vector DB
        await Promise.all(
            chunks.map((chunk, index) =>
                indexKnowledgeDocument(
                    companyId,
                    `${docId}_chunk_${index}`,
                    `${title} (Part ${index + 1})`,
                    chunk
                )
            )
        );

        return NextResponse.json({
            success: true,
            chunksProcessed: chunks.length,
            message: '檔案已成功解析並索引至向量資料庫'
        });

    } catch (error) {
        console.error('[UploadAPI] Error processing PDF:', error);
        return NextResponse.json({
            error: '解析或寫入檔案時發生錯誤',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
