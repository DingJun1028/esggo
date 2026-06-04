import { getOmniTableServerClient } from '../lib/omni-table/client';

// ============================================================================
// OmniBlueTable 自動化建表腳本：商情中心 - 每日情資庫
// ============================================================================

// 請替換為您在 OmniTable 上的實際 Space ID (空間ID)
const TARGET_SPACE_ID = process.env.OMNITABLE_SPACE_ID || 'spc_demo_12345';

async function main() {
    console.log('🚀 開始建立「每日情資」專屬的 OmniTable Datasheet...');
    const client = getOmniTableServerClient();

    try {
        console.log(`\n📦 準備在 Space [${TARGET_SPACE_ID}] 中建立表單 (Schema)...`);

        const newSheet = await client.createDatasheet(TARGET_SPACE_ID, {
            name: '商情中心 - 每日情資庫',
            description: '由自動化腳本建立的每日情資收集表單',
            fields: [
                { name: 'Title', type: 'SingleText' },
                { name: 'Content', type: 'Text' },
                { name: 'Source', type: 'SingleText' },
                { name: 'Severity', type: 'Number' },
                { name: 'Date', type: 'SingleText' } // 儲存 YYYY-MM-DD 格式
            ]
        });

        console.log(`✅ 每日情資 Datasheet 建立成功！ID: ${newSheet.id}`);

        console.log(`\n🔄 寫入初始測試資料...`);
        const syncData = [
            {
                fields: {
                    'Title': '歐盟 CBAM 碳關稅申報規範更新',
                    'Content': '歐盟執委會今日發布 CBAM 最新過渡期申報指引，要求企業需提供更詳細的產品碳足跡數據，違者可能面臨罰款。',
                    'Source': '商情中心自動抓取',
                    'Severity': 4,
                    'Date': new Date().toISOString().split('T')[0],
                }
            }
        ];
        await client.createRecords(newSheet.id, syncData, 'name');

        console.log(`✅ 成功寫入 1 筆測試情資！`);
        console.log(`👉 下一步：請將此 Datasheet ID [${newSheet.id}] 帶入您的 <DailyIntelligenceForm datasheetId="..." /> 中測試！`);
    } catch (error) {
        console.error('❌ 建立任務失敗:', error);
    }
}

main();