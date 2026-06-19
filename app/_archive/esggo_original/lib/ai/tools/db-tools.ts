import { supabase } from '@/lib/db/supabase';

// This is an example of a tool for an AI agent to call (Function Calling)
export const queryDatabaseTool = {
  name: 'query_supabase_data',
  description: '查詢 Supabase 資料庫中的資料表紀錄。適用於需要取得特定資料的情境。',
  execute: async (input: { table: string; limit?: number; select?: string }) => {
    console.log(`[queryDatabaseTool] Executing for table: ${input.table}`);
    try {
      const { data, error } = await supabase
        .from(input.table)
        .select(input.select || '*')
        .limit(input.limit || 10);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
};

export const insertDatabaseTool = {
  name: 'insert_supabase_data',
  description: '新增一筆紀錄到 Supabase 資料庫中。適用於需要儲存生成的結果或報表。',
  execute: async (input: { table: string; payload: any }) => {
    console.log(`[insertDatabaseTool] Executing for table: ${input.table}`);
    try {
      const { data, error } = await supabase
        .from(input.table)
        .insert([input.payload])
        .select();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
};
