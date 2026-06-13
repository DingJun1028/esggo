import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Supabase JSON Export Script
// 用途: 將 Supabase 資料庫中的指定表格匯出為 JSON 檔案
// ============================================================================

async function main() {
  console.log('🚀 開始匯出 Supabase 資料表至 JSON...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 缺少 Supabase 環境變數，請確保已設定 SUPABASE_URL 與 SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const tablesToExport = ['integrity_proofs']; // 可在此新增其他要匯出的表格
  const exportDir = path.join(process.cwd(), 'exports');

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  for (const table of tablesToExport) {
    console.log(`📦 正在匯出資料表: ${table}...`);
    try {
      const { data, error } = await supabase.from(table).select('*');
      
      if (error) {
        console.error(`❌ 匯出 ${table} 失敗:`, error.message);
        continue;
      }

      const filePath = path.join(exportDir, `${table}_dump.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ 成功匯出 ${data?.length || 0} 筆紀錄至: ${filePath}`);
    } catch (err) {
      console.error(`❌ 匯出 ${table} 時發生例外錯誤:`, err);
    }
  }

  console.log('🎉 JSON 匯出作業完成！');
}

main();
