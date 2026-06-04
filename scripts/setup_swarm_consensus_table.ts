import { getOmniTableServerClient } from '../lib/omni-table/client';

// ============================================================================
// OmniBlueTable 自動化建表腳本：蜂群共識決策表
// 對應模組：lib/swarm-consensus-engine.ts / lib/omni-agent-bus.ts
// ============================================================================

const TARGET_SPACE_ID = process.env.OMNITABLE_SPACE_ID || 'spc_demo_12345';

async function main() {
    console.log('🚀 開始建立「蜂群共識決策表」OmniTable Datasheet...');
    const client = getOmniTableServerClient();

    try {
        console.log(`\n📦 準備在 Space [${TARGET_SPACE_ID}] 中建立蜂群共識表...`);

        const newSheet = await client.createDatasheet(TARGET_SPACE_ID, {
            name: 'OmniSwarm - 蜂群共識決策庫',
            description: '記錄 OmniAgent 蜂群協同產生的多模型共識結果，作為可審計的決策依據',
            fields: [
                { name: 'Decision_ID', type: 'SingleText' },
                { name: 'Question', type: 'Text' },           // 共識問題
                {
                    name: 'Decision_Type',
                    type: 'SingleSelect',
                    property: {
                        options: [
                            { name: 'ARCHITECTURE', color: 'blue' },
                            { name: 'COMPLIANCE', color: 'green' },
                            { name: 'RISK_ASSESSMENT', color: 'red' },
                            { name: 'STRATEGY', color: 'purple' },
                            { name: 'TECHNICAL', color: 'cyan' }
                        ]
                    }
                },
                { name: 'Agents_Involved', type: 'Text' },   // JSON: ["Antigravity","Jules","OmniGemini"]
                { name: 'Vote_Count', type: 'Number' },
                { name: 'Consensus_Score', type: 'Number' }, // 0-100 共識強度
                { name: 'Final_Decision', type: 'Text' },
                { name: 'Reasoning', type: 'Text' },          // 推理依據
                {
                    name: 'Status',
                    type: 'SingleSelect',
                    property: {
                        options: [
                            { name: 'RESOLVED', color: 'green' },
                            { name: 'IN_PROGRESS', color: 'yellow' },
                            { name: 'DEADLOCK', color: 'red' }
                        ]
                    }
                },
                { name: 'Created_At', type: 'DateTime' },
                { name: 'ADR_Ref', type: 'SingleText' },
                { name: 'Proof_Hash', type: 'SingleText' }
            ]
        });

        console.log(`✅ 蜂群共識決策表建立成功！ID: ${newSheet.id}`);

        const seedData = [
            {
                fields: {
                    'Decision_ID': `swarm-${Date.now()}-001`,
                    'Question': '是否採用 tRPC 替代 REST API 以實現端到端型別安全？',
                    'Decision_Type': 'ARCHITECTURE',
                    'Agents_Involved': '["Antigravity","Jules","OmniNexus"]',
                    'Vote_Count': 3,
                    'Consensus_Score': 95,
                    'Final_Decision': '採用 tRPC + Zod Schema 實現端對端型別安全',
                    'Reasoning': '三代理一致認為 tRPC 可消除 runtime 契約錯誤，符合 OmniCore 端到端型別安全原則',
                    'Status': 'RESOLVED',
                    'Created_At': new Date().toISOString(),
                    'ADR_Ref': 'ADR-001',
                    'Proof_Hash': ''
                }
            }
        ];

        const records = await client.createRecords(newSheet.id, seedData, 'name');
        console.log(`✅ 成功寫入 ${records.length} 筆共識決策記錄！`);
        console.log(`\n👉 請將以下 ID 貼到 .env.local：\nOMNITABLE_SWARM_CONSENSUS_DATASHEET_ID="${newSheet.id}"`);

    } catch (error) {
        console.error('❌ 建立蜂群共識決策表失敗:', error);
    }
}

main();
