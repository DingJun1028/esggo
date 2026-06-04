import { AtomicFunction, AtomicFunctionInput } from '@/packages/types/src/AtomicFunction';
export interface RagPayload {
    query: string;
    topK?: number;
}
/**
 * Enterprise RAG Skill
 * 將使用者的自然語言查詢，轉換為向量並檢索 Supabase VectorDB 中的企業智庫 (Wiki/ADR)
 */
export declare const enterpriseRagSkill: AtomicFunction<AtomicFunctionInput & {
    payload: RagPayload;
}, {
    results: any[];
    query: string;
}>;
//# sourceMappingURL=enterpriseRagSkill.d.ts.map