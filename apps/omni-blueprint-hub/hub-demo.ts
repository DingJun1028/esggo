// Omni-Blueprint Hub - Execution Demo (5T Verified)
import { OmniBlueprintHub } from './hub-engine.js';
import { UnifiedBlueprintEntity } from './core-types.js';

console.log('=== 啟動萬能藍圖中心 (Omni-Blueprint Hub) ===\n');
const hub = new OmniBlueprintHub();

// 任務一：即時轉播
console.log('--- [1/2] 萬能藍圖【即時轉播】 ---');
const liveBlueprint = hub.createBlueprint(
  'LIVE_BROADCAST', '即時串流轉播', 'master@esggo.app',
  'https://api.esggo.app/stream/xxx', ['en', 'ja', 'zh-TW']
);
console.log(' 藍圖鑄造:', liveBlueprint.uuid);
const liveProduct = hub.manifestToProduct(liveBlueprint);
console.log(' 產品實現:', liveProduct.productName);
hub.pushBroadcastPayload(liveProduct, '永續報告書數據 ISO-14064-1 驗算已通過。', {
  en: 'Sustainability report data verified under ISO-14064-1.',
  ja: '持続可能性レポートデータは ISO-14064-1 に基づいて検証されました。'
});
console.log(' 即時轉播數據已推播 (5T 可溯源)。\n');

// 任務二：指定轉播 (一台翻譯，全員共享)
console.log('--- [2/2] 萬能藍圖【指定轉播】 ---');
const designatedBlueprint = hub.createBlueprint(
  'DESIGNATED_URL_BROADCAST', '主帳號 Email 翻譯共享廣播',
  'chief-strategy-officer@esggo.app', 'mailto:chief-strategy-officer@esggo.app', ['en', 'ja']
);
const designatedProduct = hub.manifestToProduct(designatedBlueprint);
console.log(' 藍圖鑄造:', designatedBlueprint.uuid);
console.log(' 產品實現成功！');
console.log(' [一台翻譯 全員共享] 專屬轉播網址:', designatedProduct.broadcastUrl);
hub.pushBroadcastPayload(designatedProduct,
  '主帳號來信：請確認 5T 協議單一資料表之 Hash Lock 是否完全凍結。', {
    en: 'Host Email: Please confirm whether the Hash Lock of the 5T protocol single table is fully frozen.',
    ja: 'ホストメール：5Tプロトコル単一データテーブルのHash Lockが完全凍結されているか確認してください。'
  });
console.log(' 主帳號 Email 翻譯已完成，即時廣播給所有連結訂閱者！');

console.log('\n--- 單一資料表 (Unified Table) 狀態彙整 ---');
console.table(hub.getUnifiedTable().map((row: UnifiedBlueprintEntity) => ({
  ID: row.id,
  Type: row.entityType,
  BlueprintType: row.blueprintType,
  Host: row.hostEmail,
  HashLock: row.hashLock.substring(0, 16) + '...'
})));
console.log('\n 萬能藍圖產品運作完畢，完全符合 5T 誠信協定與萬能元件心核規範。');
