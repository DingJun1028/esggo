
import { getOmniTableServerClient } from '../lib/omni-table/client';

// ============================================================================
// OmniBlueTable 全端演練：建立 Datasheet 與 同步資料
// ============================================================================

// 請替換為您在 OmniTable 上的實際 Space ID (空間ID)
const TARGET_SPACE_ID = process.env.OMNITABLE_SPACE_ID || 'spc_demo_12345';

export default async function main() {
    console.log('🚀 開始 OmniBlueTable 演練任務...');
    const client = getOmniTableServerClient();

    try {
        // ---------------------------------------------------------
        // [Phase 1] 建立全新的 Datasheet 與定義欄位 (Schema)
        // ---------------------------------------------------------
        console.log(`\n📦 準備在 Space [${TARGET_SPACE_ID}] 中建立 ESG 風險登記冊...`);

        const newSheet = await client.createDatasheet(TARGET_SPACE_ID, {
            name: 'ESG Risk Register (Demo)',
            description: '由自動化腳本建立的 ESG 企業風險控制表單',
            fields: [
                { name: 'Risk_ID', type: 'SingleText' },
                { name: 'Category', type: 'SingleText' }, // 例如: Environment, Social, Governance
                { name: 'Description', type: 'Text' },
                { name: 'Severity', type: 'Number' },
                { name: 'Status', type: 'SingleText' }
            ]
        });

        console.log(`✅ Datasheet 建立成功！ID: ${newSheet.id}`);

        // ---------------------------------------------------------
        // [Phase 2] 擴充與同步資料 (Data Ingestion)
        // ---------------------------------------------------------
        console.log(`\n🔄 準備向 Datasheet [${newSheet.id}] 寫入/同步資料...`);

        // 模擬要同步的外部資料 (例如來自 Supabase 或 OmniBlue)
        const syncData = [
            { fields: { 'Risk_ID': 'RSK-E-001', 'Category': 'Environment', 'Description': '供應鏈碳排放數據造假風險', 'Severity': 5, 'Status': 'Open' } },
            { fields: { 'Risk_ID': 'RSK-S-002', 'Category': 'Social', 'Description': '廠區工安意外未通報', 'Severity': 4, 'Status': 'In Progress' } },
            { fields: { 'Risk_ID': 'RSK-G-003', 'Category': 'Governance', 'Description': '董事會多元化指標未達標', 'Severity': 2, 'Status': 'Resolved' } },
        ];

        // 使用 createRecords 進行寫入
        // 注意：fieldKey="name" 代表我們使用欄位名稱 (Risk_ID) 來對應，而非欄位 ID
        const records = await client.createRecords(newSheet.id, syncData, 'name');

        console.log(`✅ 成功寫入 ${records.length} 筆風險資料！`);
        console.log(`👉 下一步：將 Datasheet ID [${newSheet.id}] 貼到您的前端頁面中測試讀取。`);

    } catch (error) {
        console.error('❌ 任務失敗:', error);
    }
}

if (require.main === module) {
    main();
}