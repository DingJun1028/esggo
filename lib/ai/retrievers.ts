import { defineFirestoreRetriever } from '@genkit-ai/firebase';
import { textEmbedding004 } from '@genkit-ai/googleai';
import { ai } from '../agents/genkit';
import { getFirestore } from 'firebase-admin/firestore';

import { firebaseAdmin } from '../firebase-admin';

/**
 * 🚀 企業專屬檢索器 (Enterprise Retriever)
 * 負責從 Firestore 向量資料庫中檢索與查詢最相關的 ESG 知識
 */
export const enterpriseRetriever = firebaseAdmin ? defineFirestoreRetriever(ai, {
  name: 'enterpriseRetriever',
  firestore: getFirestore(),
  collection: 'enterprise_knowledge',
  embedder: textEmbedding004,
  vectorField: 'embedding',
  contentField: 'text',
  metadataFields: ['companyId', 'docId', 'title'],
}) : null as any;

/**
 * 🛠️ 知識索引器 (Knowledge Indexer)
 * 將文字切塊後的內容轉為向量並存入 Firestore
 */
export async function indexKnowledgeDocument(
  companyId: string,
  docId: string,
  title: string,
  textChunk: string
) {
  const db = getFirestore();
  const collection = db.collection('enterprise_knowledge');

  // 1. 生成向量 (Embedding)
  // 注意：這裡直接使用 genkit 的 embed 方法
  const embeddingResult = await ai.embed({
    embedder: textEmbedding004,
    content: textChunk,
  });

  // 2. 寫入 Firestore
  await collection.add({
    companyId,
    docId,
    title,
    text: textChunk,
    embedding: embeddingResult,
    createdAt: new Date(),
  });

  console.log(`[Indexer] Successfully indexed document for company: ${companyId}`);
}