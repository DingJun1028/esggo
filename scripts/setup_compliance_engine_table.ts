import { getOmniTableServerClient } from '../lib/omni-table/client';

// ============================================================================
// OmniBlueTable 自動化建表腳本：合規引擎掃描結果表
// 對應模組：src/compliance.ts / lib/policy-engine.ts
// ============================================================================

const TARGET_SPACE_ID = process.env.OMNITABLE_SPACE_ID || 'spc_demo_12345';

async function main() {
    console.log('🚀 開始建立「合規引擎掃描結果表」OmniTable Datasheet...');
    const client = getOmniTableServerClient();

    try {
        console.log(`\n📦 準備在 Space [${TARGET_SPACE_ID}] 中建立合規掃描表...`);

        const newSheet = await client.createDatasheet(TARGET_SPACE_ID, {
            name: '合規引擎 - 掃描結果庫',
            description: '記錄合規引擎（Policy Engine）對各業務單元的自動化掃描結果與違規紀錄',
            fields: [
                { name: 'Scan_ID', type: 'SingleText' },
                { name: 'Policy_Name', type: 'SingleText' },
                { name: 'Target_Entity', type: 'SingleText' }, // 被掃描的實體（部門/供應商/系統）
                {
                    name: 'Standard',
                    type: 'SingleSelect',
                    property: {
                        options: [
                            { name: 'GRI', color: 'green' },
                            { name: 'SASB', color: 'blue' },
                            { name: 'TCFD', color: 'teal' },
                            { name: 'ISO-14001', color: 'cyan' },
                            { name: 'CBAM', color: 'orange' },
                            { name: 'TWSE-ESG', color: 'purple' }
                        ]
                    }
                },
                {
                    name: 'Result',
                    type: 'SingleSelect',
                    property: {
                        options: [
                            { name: 'Pass', color: 'green' },
                            { name: 'Warning', color: 'yellow' },
                            { name: 'Fail', color: 'red' },
                            { name: 'N/A', color: 'gray' }
                        ]
                    }
                },
                { name: 'Score', type: 'Number' },           // 合規得分 0-100
                { name: 'Detail', type: 'Text' },             // 違規細節描述
                { name: 'Recommendation', type: 'Text' },    // AI 建議修正動作
                { name: 'Scan_Timestamp', type: 'DateTime' },
                { name: 'Next_Review', type: 'SingleText' },
                { name: 'Proof_Hash', type: 'SingleText' }   // 5T 可驗算封印
            ]
        });

        console.log(`✅ 合規掃描表建立成功！ID: ${newSheet.id}`);

        // ── 寫入初始掃描記錄 ────────────────────────────────────────────
        console.log(`\n🔍 寫入初始掃描記錄...`);
        const seedData = [
            {
                fields: {
                    'Scan_ID': 'SCN-GRI-001',
                    'Policy_Name': 'GRI 305-1 直接溫室氣體排放',
                    'Target_Entity': '台灣總部 製造部門',
                    'Standard': 'GRI',
                    'Result': 'Warning',
                    'Score': 68,
                    'Detail': '碳排放報告週期延遲，Scope 1 數據缺少第三方驗證',
                    'Recommendation': '建議在 30 天內提交第三方驗證報告，並更新碳排放監測頻率至月度',
                    'Scan_Timestamp': new Date().toISOString(),
                    'Next_Review': new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                    'Proof_Hash': ''
                }
            },
            {
                fields: {
                    'Scan_ID': 'SCN-TWSE-002',
                    'Policy_Name': 'TWSE ESG 永續報告書揭露要求',
                    'Target_Entity': '集團總部 法務部',
                    'Standard': 'TWSE-ESG',
                    'Result': 'Pass',
                    'Score': 92,
                    'Detail': '符合台灣證交所 2026 年 ESG 報告書揭露規範',
                    'Recommendation': '維持現有揭露品質，建議新增供應商 ESG 評估章節',
                    'Scan_Timestamp': new Date().toISOString(),
                    'Next_Review': new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
                    'Proof_Hash': ''
                }
            }
        ];

        const records = await client.createRecords(newSheet.id, seedData, 'name');
        console.log(`✅ 成功寫入 ${records.length} 筆掃描記錄！`);
        console.log(`\n👉 下一步：請將以下 ID 貼到 .env.local：\nOMNITABLE_COMPLIANCE_DATASHEET_ID="${newSheet.id}"`);

    } catch (error) {
        console.error('❌ 建立合規引擎掃描表失敗:', error);
    }
}

main();
