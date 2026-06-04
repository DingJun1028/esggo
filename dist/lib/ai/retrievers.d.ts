/**
 * 🚀 企業專屬檢索器 (Enterprise Retriever)
 * 負責從 Firestore 向量資料庫中檢索與查詢最相關的 ESG 知識
 */
export declare const enterpriseRetriever: any;
/**
 * 🛠️ 知識索引器 (Knowledge Indexer)
 * 將文字切塊後的內容轉為向量並存入 Firestore
 */
export declare function indexKnowledgeDocument(companyId: string, docId: string, title: string, textChunk: string): Promise<void>;
//# sourceMappingURL=retrievers.d.ts.map