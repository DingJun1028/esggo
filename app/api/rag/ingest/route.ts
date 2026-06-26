import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { ncbRagService } from '@/lib/ncb-utils';

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

    // 2. 切片 (Chunking)
    const chunks = chunkText(rawText, 1000, 200);

    // 3. 寫入 NCBDB
    const promises = chunks.map((chunk, index) => 
      ncbRagService.saveKnowledgeChunks({
        user_id: userId,
        content: chunk,
        source: file.name,
        chunk_index: index,
        created_at: new Date().toISOString()
      })
    );
    
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
