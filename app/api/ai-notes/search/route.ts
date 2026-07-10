// ============================================================
// 語意搜尋 API - POST
// ============================================================

import { NextRequest } from 'next/server';
import { jsonResponse, jsonError, validateParams } from '@/lib/api-utils';
import { getNCBClient } from '@/lib/ncb-client';
import { Pool } from 'pg';
import type { SearchQuery, SearchResult } from '@/types/notes';

// PostgreSQL 連接池（pgvector）
const pgPool = new Pool({
  connectionString: process.env.PGVECTOR_URL,
});

// POST /api/ai-notes/search - 語意搜尋
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, filters, limit, threshold } = body;

    // 驗證必要欄位
    const validation = validateParams(
      { text },
      {
        text: { required: true, type: 'string', minLength: 1 },
      }
    );

    if (!validation.valid) {
      return jsonError(validation.errors!.join(', '), 400);
    }

    // 生成查詢向量
    const queryEmbedding = await generateEmbedding(text);

    // 執行向量搜尋
    const vectorResults = await pgPool.query(
      `SELECT * FROM search_notes_semantic($1, $2, $3)`,
      [
        JSON.stringify(queryEmbedding),
        limit || 10,
        threshold || 0.5,
      ]
    );

    if (vectorResults.rows.length === 0) {
      return jsonResponse({ data: [], total: 0 });
    }

    // 從 NoCodeBackend 取得完整筆記資料
    const noteIds = vectorResults.rows.map(r => r.note_id);
    const ncb = getNCBClient();

    const notes = await Promise.all(
      noteIds.map(async (noteId: string) => {
        try {
          return await ncb.getNoteWithTags(noteId);
        } catch {
          return null;
        }
      })
    );

    // 合併結果
    const results: SearchResult[] = vectorResults.rows
      .map((row, index) => ({
        note: notes[index],
        similarity: row.similarity,
      }))
      .filter((r): r is SearchResult => r.note !== null);

    return jsonResponse({
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error('Error performing semantic search:', error);
    return jsonError('Failed to perform semantic search', 500);
  }
}

// 生成向量嵌入
async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text.substring(0, 8000), // 限制長度
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API Error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}
