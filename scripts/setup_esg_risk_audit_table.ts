import { getOmniTableServerClient } from '../lib/omni-table/client';

// ============================================================================
// OmniBlueTable 自動化建表腳本：ESG 風險稽核庫
// 對應模組：lib/services/esg-data-service.ts
// ============================================================================

const TARGET_SPACE_ID = process.env.OMNITABLE_SPACE_ID || 'spc_demo_12345';

async function main() {
    console.log('🚀 開始建立「ESG 風險稽核庫」OmniTable Datasheet...');
    const client = getOmniTableServerClient();

    try {
        console.log(`\n📦 準備在 Space [${TARGET_SPACE_ID}] 中建立 ESG 風險稽核表...`);

        const newSheet = await client.createDatasheet(TARGET_SPACE_ID, {
            name: 'ESG 風險稽核庫',
            description: '記錄企業 ESG 三大面向（環境/社會/治理）的風險項目與稽核結果',
            fields: [
                { name: 'Risk_ID', type: 'SingleText' },
                {
                    name: 'Category',
                    type: 'SingleSelect',
                    property: {
                        options: [
                            { name: 'Environment', color: 'green' },
                            { name: 'Social', color: 'blue' },
                            { name: 'Governance', color: 'purple' }
                        ]
                    }
                },
                { name: 'Description', type: 'Text' },
                { name: 'Severity', type: 'Number' },
                {
                    name: 'Status',
                    type: 'SingleSelect',
                    property: {
                        options: [
                            { name: 'Open', color: 'red' },
                            { name: 'In Progress', color: 'yellow' },
                            { name: 'Resolved', color: 'green' },
                            { name: 'Closed', color: 'gray' }
                        ]
                    }
                },
                { name: 'Assignee', type: 'SingleText' },
                { name: 'Due_Date', type: 'SingleText' },
                { name: 'Evidence_URL', type: 'URL' },
                { name: 'Hash_Lock', type: 'SingleText' }, // 5T 封印
                { name: 'Created_At', type: 'DateTime' }
            ]
        });

        console.log(`✅ ESG 風險稽核表建立成功！ID: ${newSheet.id}`);

        // ── 寫入初始種子資料 ──────────────────────────────────────────────
        console.log(`\n🌱 寫入初始種子資料...`);
        const seedData = [
            {
                fields: {
                    'Risk_ID': 'RSK-E-001',
                    'Category': 'Environment',
                    'Description': '供應鏈 Scope 3 碳排放數據未完整揭露',
                    'Severity': 5,
                    'Status': 'Open',
                    'Assignee': 'ESG Team',
                    'Due_Date': new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                    'Hash_Lock': ''
                }
            },
            {
                fields: {
                    'Risk_ID': 'RSK-S-002',
                    'Category': 'Social',
                    'Description': '廠區職業安全事故通報延遲',
                    'Severity': 4,
                    'Status': 'In Progress',
                    'Assignee': 'HR Dept',
                    'Due_Date': new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                    'Hash_Lock': ''
                }
            },
            {
                fields: {
                    'Risk_ID': 'RSK-G-003',
                    'Category': 'Governance',
                    'Description': '董事會性別多元化比例未達 30%',
                    'Severity': 3,
                    'Status': 'Open',
                    'Assignee': 'Board Secretary',
                    'Due_Date': new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
                    'Hash_Lock': ''
                }
            }
        ];

        const records = await client.createRecords(newSheet.id, seedData, 'name');
        console.log(`✅ 成功寫入 ${records.length} 筆種子風險資料！`);
        console.log(`\n👉 下一步：請將以下 ID 貼到 .env.local：\nOMNITABLE_ESG_RISK_DATASHEET_ID="${newSheet.id}"`);

    } catch (error) {
        console.error('❌ 建立 ESG 風險稽核表失敗:', error);
    }
}

main();
