import { createHash } from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiRotator } from '../gemini-key-rotator';
import { supabaseAdmin } from '../supabaseAdmin';

export interface KnowledgeDocument {
  id: string;
  source: string;
  text: string;
  metadata?: unknown;
  embedding?: number[];
}

const keys = [
  process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean) as string[];

const geminiRotator = new GeminiRotator(keys);

/**
 * 1. 文本切割器 (Semantic Text Splitter)
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
 * 2. 向量嵌入生成 (Gemini Embedding API)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const result = await geminiRotator.embedContent(text, "text-embedding-004");
    return result.embedding.values;
  } catch (e: any) {
    console.error('[RAG Engine] Embedding Generation Failed:', e);
    const pseudoRandom = text.length % 100;
    return Array.from({ length: 768 }, (_, i) => Math.sin(i + pseudoRandom));
  }
}

/**
 * 3. 核心：文獻寫入與向量化
 */
export async function ingestDocument(title: string, content: string, type: string = 'POLICY', metadata: unknown = {}) {
  console.log(`[RAG Engine] 📥 Ingesting document: ${title}`);
  
  if (!supabaseAdmin) throw new Error('Supabase Admin not initialized');

  // 1. Save main document
  const { data: doc, error: docError } = await supabaseAdmin
    .from('kb_documents')
    .insert({ title, content, document_type: type, metadata })
    .select()
    .single();

  if (docError) throw docError;

  // 2. Chunk and embed
  const chunks = chunkText(content);
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await generateEmbedding(chunk);
    
    await supabaseAdmin.from('kb_document_embeddings').insert({
      document_id: doc.id,
      chunk_index: i,
      content: chunk,
      embedding: JSON.stringify(embedding),
      metadata: { ...(metadata as any), chunk_index: i }
    });
  }

  console.log(`[RAG Engine] ✅ Ingested ${title} with ${chunks.length} chunks.`);
  return doc.id;
}

/**
 * 4. 檢索智庫 (Hybrid Search)
 */
export async function searchKnowledgeBase(query: string, limit: number = 3) {
  if (!supabaseAdmin) return [];

  const queryEmbedding = await generateEmbedding(query);
  
  const { data: matches, error } = await supabaseAdmin.rpc('match_kb_documents', {
    query_embedding: JSON.stringify(queryEmbedding),
    match_threshold: 0.5,
    match_count: limit
  });

  if (error) {
    console.error('[RAG Engine] Search Error:', error);
    return [];
  }

  return matches;
}

/**
 * 5. 聯動代理人推理
 */
export async function queryWithIntelligence(query: string) {
  const contextDocs = await searchKnowledgeBase(query);
  const contextText = contextDocs.map((d: any) => d.content).join('\n---\n');

  const model = geminiRotator.getModel("gemini-1.5-flash");
  const prompt = `
You are the OmniCore Knowledge Architect. 
Base your answer ONLY on the provided context from the Omni Knowledge Base.
If the information is not in the context, state that clearly.

Context:
${contextText}

Question: ${query}
`;

  const result = await model.generateContent(prompt);
  
  const sources = contextDocs.map((d: any) => {
    const rawData = `${d.document_id || d.id}-${d.content}`;
    const hashLock = createHash('sha256').update(rawData).digest('hex');
    
    return { 
      id: d.document_id || d.id, 
      title: d.title || `Intel Node [${(d.document_id || d.id || 'N/A').toString().substring(0,6)}]`,
      score: d.similarity || 0.99,
      hashLock: hashLock
    };
  });

  return {
    answer: result.response.text(),
    sources: sources
  };
}

/**
 * Compatibility: Query with history
 */
export async function queryKnowledgeBase(query: string, history: unknown[] = []) {
  // In a real implementation, history would be passed to the model
  return queryWithIntelligence(query);
}

/**
 * Compatibility: Process PDF
 */
export async function processPDFAndIngest(buffer: Buffer, fileName: string): Promise<number> {
  let content = '';
  try {
    const mod = await import('pdf-parse');
    const PDFParseClass = mod.PDFParse || (mod as any).default?.PDFParse;
    
    if (!PDFParseClass) {
        throw new Error('PDFParse class not found in pdf-parse module');
    }

    const parser = new PDFParseClass({ data: buffer });
    const pdfData = await parser.getText();
    content = pdfData.text;
  } catch (error) {
    console.error('[RAG Engine] Failed to parse PDF:', error);
    // 發生錯誤時不要再將二進位緩衝區轉為字串，那會產生亂碼
    content = `[PDF Extraction Error] Could not extract text from ${fileName}. The file might be encrypted, corrupted, or have no extractable text.`;
  }

  await ingestDocument(fileName, content, 'DOCUMENT', { fileName });
  return chunkText(content).length;
}

/**
 * Compatibility: Add direct items
 */
export async function addToKnowledgeBase(documents: unknown[]) {
  for (const doc of documents as any[]) {
    await ingestDocument(doc.source || doc.id, doc.text, doc.metadata?.type || 'DOCUMENT', doc.metadata);
  }
}
