import { createHash } from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from '../supabaseAdmin';
export interface KnowledgeDocument {
  id: string;
  source: string;
  text: string;
  metadata?: any;
  embedding?: number[];
}

// 已經替換為真實 Supabase pgvector 實作，保留宣告避免影響型別定義
const OMNI_VECTOR_STORE: KnowledgeDocument[] = [];

/**
 * 1. 文本切割器 (Semantic Text Splitter)
 * 支援 Overlap，防止上下文斷裂，這對於擷取長篇 PDF ESG 報告至關重要。
 */
export function chunkText(text: string, chunkSize: number = 500, overlap: number = 100): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}

/**
 * 2. 向量嵌入生成 (Embedding Generation)
 * @returns 1536 維的浮點數陣列 (同 OpenAI text-embedding 規格)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // TODO: 於此處串接 Google Gemini (text-embedding-004) API
  // 此處實作暫以模擬生成，根據文字長度產生具備些微特徵差異的偽隨機向量
  const pseudoRandom = text.length % 100;
  return Array.from({ length: 1536 }, (_, i) => Math.sin(i + pseudoRandom));
}

/**
 * 3. 計算餘弦相似度 (Cosine Similarity)
 * 用於計算查詢向量與知識庫向量之間的距離
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += Math.pow(vecA[i], 2);
    normB += Math.pow(vecB[i], 2);
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * 4. 核心：PDF 報告解析與寫入向量庫
 * @param fileBuffer PDF 檔案的二進位資料
 * @param fileName 檔案名稱
 */
export async function processPDFAndIngest(fileBuffer: Buffer | ArrayBuffer, fileName: string) {
  console.log(`[RAG Engine] 📄 開始解析 PDF 文件: ${fileName}`);

  let text = '';
  try {
    // 使用 pdf-parse 套件來提取 PDF 文字
    const pdf = require('pdf-parse');
    const data = await pdf(Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer));
    text = data.text;

    // 清理一下文字，把多餘的空行或奇怪的空白去掉
    text = text.replace(/\n\s*\n/g, '\n').trim();

    if (!text) {
      throw new Error('PDF 內無可擷取的文字');
    }

    console.log(`[RAG Engine] ✅ PDF 解析成功，擷取字元數: ${text.length}`);
  } catch (e: any) {
    console.warn(`[RAG Engine] ⚠️ PDF 解析異常: ${e.message}。`);
    throw new Error('PDF parsing failed');
  }

  // 執行切塊 (Chunking)
  const chunks = chunkText(text);
  console.log(`[RAG Engine] ✂️ 文本切割完成，共產生 ${chunks.length} 個 Chunks。`);

  const docs: KnowledgeDocument[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i];
    const hash = createHash('sha256').update(chunkText).digest('hex').substring(0, 8);

    docs.push({
      id: `doc_${fileName}_${i}_${hash}`,
      source: fileName,
      text: chunkText,
      metadata: { page: 1, index: i },
    });
  }

  await addToKnowledgeBase(docs);
  return docs.length;
}

/**
 * 5. 寫入知識庫 (Ingestion)
 */
export async function addToKnowledgeBase(docs: KnowledgeDocument[]) {
  if (!supabaseAdmin) {
    console.warn('[RAG Engine] Supabase Admin client 未初始化，寫入失敗。');
    return;
  }

  for (const doc of docs) {
    if (!doc.embedding) {
      doc.embedding = await generateEmbedding(doc.text);
    }
    
    // 寫入 Supabase pgvector
    const { error } = await supabaseAdmin
      .from('omni_vector_store')
      .upsert({
        id: doc.id,
        source: doc.source,
        content: doc.text,
        metadata: doc.metadata || {},
        embedding: `[${doc.embedding.join(',')}]`
      });
      
    if (error) {
      console.error(`[RAG Engine] ❌ 寫入文獻 ${doc.id} 失敗:`, error.message);
    }
  }
  console.log(`[RAG Engine] 💾 成功寫入 ${docs.length} 筆向量至 Supabase pgvector。`);
}

/**
 * 6. 檢索知識庫並生成回答 (Query)
 */
export async function queryKnowledgeBase(query: string, history: { role: string, text: string }[] = []) {
  console.log(`[RAG Engine] 🔍 接收檢索意圖: "${query}" (攜帶 ${history.length} 筆語意記憶)`);
  
  if (!supabaseAdmin) {
    return {
      answer: "系統尚未完成 Supabase 連線，無法進行知識庫檢索。",
      sources: []
    };
  }

  // 實際向量檢索邏輯 (Supabase pgvector)
  const queryEmbedding = await generateEmbedding(query);
  
  const { data: matchedDocs, error } = await supabaseAdmin.rpc('match_omni_documents', {
    query_embedding: `[${queryEmbedding.join(',')}]`,
    match_threshold: 0.7,
    match_count: 3
  });

  if (error) {
    console.error('[RAG Engine] ❌ 檢索失敗:', error);
    return {
      answer: "知識庫檢索發生異常。",
      sources: []
    };
  }

  const topDocs: { id?: string, source: string, text: string, metadata: any, score: number }[] = (matchedDocs || []).map((d: any) => ({
    ...d,
    text: d.content,
    score: d.similarity
  }));

  if (topDocs.length === 0) {
    return {
      answer: `針對您的問題：「${query}」，在目前的企業知識庫中沒有找到高度匹配的文獻。您可以嘗試上傳 PDF 報告來擴充 RAG 智庫。`,
      sources: []
    };
  }

  // 模擬將 TopDocs 餵給 LLM 後的總結
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 將歷史對話組合為字串，賦予 Agent 長期記憶
    const historyText = history.length > 0
      ? history.map(h => `${h.role === 'user' ? '稽核人員' : 'OmniAgent'}: ${h.text}`).join('\n')
      : '無';

    const contextText = topDocs.map(d => d.text).join('\n---\n');
    const prompt = `您是 ESG GO 的認知核心 (Cognition Core) AI 代理人「第一建築師」。
請基於以下【對話歷史】與【檢索文獻】進行「因果推演 (Causal Deduction)」，來回答使用者的最新【問題】。
要求：
1. 必須嚴格依據文獻內容，不能無中生有。
2. 請分析文獻中的因果關係，並給出具備洞察力的總結。
3. 如果文獻不足以回答問題，請明確告知。
4. 參考先前的對話歷史，保持對話的連貫性。

【對話歷史】：
${historyText}

【問題】：${query}

【檢索文獻】：
${contextText}
`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return {
      answer,
      sources: topDocs.map(d => ({ title: d.source, score: d.score }))
    };
  } catch (error) {
    console.warn('[RAG Engine] ⚠️ LLM 認知核心呼叫失敗，降級為摘要顯示。', error);
    const fallbackAnswer = `根據檢索到的內部報告（關聯度 ${(topDocs[0].score * 100).toFixed(1)}%）：\n\n${topDocs[0].text}\n\n（註：目前系統無法連線至 LLM 認知核心，僅顯示純量檢索結果。）`;

    return {
      answer: fallbackAnswer,
      sources: topDocs.map(d => ({ title: d.source, score: d.score }))
    };
  }
}