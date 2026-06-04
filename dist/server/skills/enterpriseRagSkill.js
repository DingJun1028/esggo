"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterpriseRagSkill = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
/**
 * Enterprise RAG Skill
 * 將使用者的自然語言查詢，轉換為向量並檢索 Supabase VectorDB 中的企業智庫 (Wiki/ADR)
 */
const enterpriseRagSkill = async (input) => {
    const start = Date.now();
    const { context, payload } = input;
    const { query, topK = 5 } = payload;
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase credentials not configured for RAG search.');
        }
        const supabase = (0, supabase_js_1.createClient)(supabaseUrl, serviceRoleKey, {
            auth: { persistSession: false }
        });
        // 1. 生成 Query 的 Vector Embeddings
        // 實務上這裡會呼叫 OpenAI (text-embedding-3-small) 或 Gemini 的 Embedding API
        // 為了展示 Atomic Function 架構與確保相容性，這裡模擬出一個 [1536] 維度的向量
        const simulatedQueryEmbedding = Array.from({ length: 1536 }, () => Math.random() * 0.1);
        // 2. 透過 Supabase pgvector 執行 Cosine Similarity 檢索 (呼叫預存程序)
        const { data: vectorData, error: vectorError } = await supabase.rpc('match_documents', {
            query_embedding: simulatedQueryEmbedding,
            match_threshold: 0.75, // 相似度門檻
            match_count: topK
        });
        // 3. Fallback: 如果資料庫尚未準備好 match_documents 預存程序或 pgvector，則退回文字搜尋
        let results = vectorData;
        if (vectorError || !vectorData) {
            console.warn('[Enterprise RAG] Vector search failed or unavailable, falling back to text search.', vectorError?.message);
            const { data: textData, error: textError } = await supabase
                .from('omni_knowledge_base')
                .select('id, title, content, path')
                .textSearch('content', query)
                .limit(topK);
            if (textError) {
                throw textError;
            }
            results = textData;
        }
        return {
            success: true,
            data: {
                query,
                results: results || []
            },
            metadata: {
                executionTime: Date.now() - start,
                version: '1.0.0'
            }
        };
    }
    catch (error) {
        return {
            success: false,
            error: error,
            metadata: {
                executionTime: Date.now() - start,
                version: '1.0.0'
            }
        };
    }
};
exports.enterpriseRagSkill = enterpriseRagSkill;
//# sourceMappingURL=enterpriseRagSkill.js.map