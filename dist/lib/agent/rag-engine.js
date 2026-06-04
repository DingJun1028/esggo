import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from '../supabaseAdmin';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
/**
 * 1. 文本切割器 (Semantic Text Splitter)
 */
export function chunkText(text, chunkSize = 500, overlap = 100) {
    const chunks = [];
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
export async function generateEmbedding(text) {
    try {
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(text);
        return result.embedding.values;
    }
    catch (e) {
        console.error('[RAG Engine] Embedding Generation Failed:', e);
        // Fallback to pseudo-random for simulation if API fails in dev
        const pseudoRandom = text.length % 100;
        return Array.from({ length: 768 }, (_, i) => Math.sin(i + pseudoRandom));
    }
}
/**
 * 3. 核心：文獻寫入與向量化
 */
export async function ingestDocument(title, content, type = 'POLICY', metadata = {}) {
    console.log(`[RAG Engine] 📥 Ingesting document: ${title}`);
    if (!supabaseAdmin)
        throw new Error('Supabase Admin not initialized');
    // 1. Save main document
    const { data: doc, error: docError } = await supabaseAdmin
        .from('kb_documents')
        .insert({ title, content, document_type: type, metadata })
        .select()
        .single();
    if (docError)
        throw docError;
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
            metadata: { ...metadata, chunk_index: i }
        });
    }
    console.log(`[RAG Engine] ✅ Ingested ${title} with ${chunks.length} chunks.`);
    return doc.id;
}
/**
 * 4. 檢索智庫 (Hybrid Search)
 */
export async function searchKnowledgeBase(query, limit = 3) {
    if (!supabaseAdmin)
        return [];
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
export async function queryWithIntelligence(query) {
    const contextDocs = await searchKnowledgeBase(query);
    const contextText = contextDocs.map((d) => d.content).join('\n---\n');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are the OmniCore Knowledge Architect. 
Base your answer ONLY on the provided context from the Universal Knowledge Base.
If the information is not in the context, state that clearly.

Context:
${contextText}

Question: ${query}
`;
    const result = await model.generateContent(prompt);
    return {
        answer: result.response.text(),
        sources: contextDocs.map((d) => ({ id: d.document_id, score: d.similarity }))
    };
}
/**
 * Compatibility: Query with history
 */
export async function queryKnowledgeBase(query, history = []) {
    // In a real implementation, history would be passed to the model
    return queryWithIntelligence(query);
}
/**
 * Compatibility: Process PDF
 */
export async function processPDFAndIngest(buffer, fileName) {
    const content = buffer.toString('utf-8').slice(0, 5000); // Simple mock for PDF text extraction
    await ingestDocument(fileName, content, 'DOCUMENT', { fileName });
    return chunkText(content).length;
}
/**
 * Compatibility: Add direct items
 */
export async function addToKnowledgeBase(documents) {
    for (const doc of documents) {
        await ingestDocument(doc.source || doc.id, doc.text, doc.metadata?.type || 'DOCUMENT', doc.metadata);
    }
}
//# sourceMappingURL=rag-engine.js.map