import fs from 'fs';
import path from 'path';
import { NotionSyncService } from '../src/core/services/notion-sync-service';

/**
 * 將文件推送至 Notion API (知識資產化)
 */
async function syncToNotion() {
  const docPath = path.join(__dirname, '../docs/ADR-005-production-deployment-strategy.md');
  if (!fs.existsSync(docPath)) {
    console.error('找不到文件:', docPath);
    return;
  }

  const content = fs.readFileSync(docPath, 'utf8');
  console.log('=== [Notion Sync] 知識資產化同步啟動 ===');
  console.log('上傳目標: Notion Workspace (ESG GO Architecture)');
  console.log('上傳內容大小:', content.length, '字節');
  
  const notionService = new NotionSyncService();
  try {
    const pageId = await notionService.syncAsset({
      title: 'ADR-005: ESGGO v5.0 生產環境部署與 CI/CD 策略',
      content: content,
      category: 'Architecture Decision'
    });
    console.log('✅ 同步成功！');
    console.log('Notion 頁面 ID:', pageId);
  } catch (err) {
    console.error('同步失敗:', err);
  }
}

syncToNotion().catch(console.error);
