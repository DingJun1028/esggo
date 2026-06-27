import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { agnesApi } from '@/lib/agnes-api';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string || 'default_user';

    if (!file) {
      return NextResponse.json({ error: '未提供 PDF 檔案' }, { status: 400 });
    }

    // 將 File 轉換為 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. 解析 PDF
    const pdfData = await pdfParse(buffer);
    const rawText = pdfData.text.replace(/\n+/g, '\n').trim();

    // 1.5 AGNES 預處理 (擷取前 2000 字元進行摘要分析)
    let summaryContext = '';
    try {
      const sampleText = rawText.substring(0, 2000);
      const agnesRes = await agnesApi.processRequest(`請分析以下文本並提取摘要：\n${sampleText}`);
      if (agnesRes.success) {
        summaryContext = agnesRes.data.output;
      }
    } catch (e) {
      console.warn('[AGNES_API] 預處理失敗，繼續執行標準流程', e);
    }

    // 2. 切片 (Chunking)
    const chunks = chunkText(rawText, 1000, 200);

    // 3. 寫入 Firebase Firestore
    const promises = chunks.map((chunk, index) => {
      const finalContent = summaryContext 
        ? `[Global Context: ${summaryContext}]\n\n${chunk}` 
        : chunk;

      return addDoc(collection(db, 'rag_knowledge'), {
        user_id: userId,
        content: finalContent,
        source: file.name,
        chunk_index: index,
        created_at: new Date().toISOString()
      });
    });
    
    await Promise.all(promises);

    return NextResponse.json({
      success: true,
      message: 'PDF 解析與 Chunking 寫入成功',
      totalChunks: chunks.length,
      pageCount: pdfData.numpages
    });

  } catch (error: any) {
    console.error('PDF Ingestion Error:', error);
    return NextResponse.json(
      { error: `解析失敗: ${error.message}` },
      { status: 500 }
    );
  }
}
