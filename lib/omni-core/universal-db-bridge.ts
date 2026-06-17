/**
 * Universal Database Bridge - 萬能資料庫橋接層
 * 整合 Supabase, Firebase DataConnect, NCBDB 三大資料來源
 */

import { supabase } from '../db/supabase';
import { dcInsertEternalMemory, dcListEternalMemories } from '../dataconnect-services';
import { ncbClient } from '../ncbdb';
import { createHash } from 'crypto';

const secureHash = async (data: unknown): Promise<string> => {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  return createHash('sha256').update(str).digest('hex');
};

// 萬能永憶 (Eternal Memory) - Firebase DataConnect 儲存
export async function storeEternalMemory(memory: {
  content: string;
  type: string;
  tags?: string[];
  sourceOrigin?: string;
}) {
  const hashLock = await secureHash(memory.content);
  return await dcInsertEternalMemory({
    type: memory.type as any,
    content: memory.content,
    tags: memory.tags?.join(',') || '',
    hashLock: hashLock,
    consolidated: false,
    sourceOrigin: memory.sourceOrigin || 'Client',
  } as any);
}

// 萬能智庫 (Knowledge Library) - Supabase
export async function storeKnowledge(knowledge: {
  title: string;
  content: string;
  category: string;
  userId: string;
}) {
  const { error } = await supabase.from('omni_notes').insert({
    user_id: knowledge.userId,
    content: knowledge.content,
    type: knowledge.category,
    card_uuid: knowledge.title,
    tags: [knowledge.category, 'knowledge'],
  });
  return !error;
}

// 萬能個資 (User RAG Database) - Supabase user_memory
export async function storeUserMemory(memory: {
  userId: string;
  memoryKey: string;
  memoryValue: unknown;
  memoryType: string;
  context?: unknown;
}) {
  const hashLock = await secureHash(memory.memoryValue);
  const { error } = await supabase.from('user_memory').upsert({
    user_id: memory.userId,
    memory_key: memory.memoryKey,
    memory_value: memory.memoryValue,
    memory_type: memory.memoryType,
    context: memory.context,
    hash_lock: hashLock,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

// NCBDB 全域展示層
export async function syncToNCBDB(tableName: string, data: Record<string, unknown>) {
  return await ncbClient.upsertRecord(tableName, data);
}

// 三大資料庫的統一查詢介面
export const omniDB = {
  eternal: {
    list: () => dcListEternalMemories(),
    store: storeEternalMemory,
  },
  knowledge: {
    list: (userId: string) => supabase.from('omni_notes').select('*').eq('user_id', userId),
    store: storeKnowledge,
    search: (query: string) => supabase.from('omni_notes').select('*').textSearch('content', query),
  },
  userMemory: {
    list: (userId: string) => supabase.from('user_memory').select('*').eq('user_id', userId),
    store: storeUserMemory,
    get: (userId: string, key: string) =>
      supabase.from('user_memory').select('*').eq('user_id', userId).eq('memory_key', key).single(),
  },
  ncb: {
    sync: syncToNCBDB,
  },
};
