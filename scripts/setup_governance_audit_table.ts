import { getOmniTableServerClient } from '../lib/omni-table/client';

// ============================================================================
// OmniBlueTable 自動化建表腳本：治理稽核日誌表
// 對應模組：lib/governance-audit.ts / lib/governance-engine.ts
// ============================================================================

const TARGET_SPACE_ID = process.env.OMNITABLE_SPACE_ID || 'spc_demo_12345';

async function main() {
    console.log('🚀 開始建立「治理稽核日誌」OmniTable Datasheet...');
    const client = getOmniTableServerClient();

    try {
        console.log(`\n📦 準備在 Space [${TARGET_SPACE_ID}] 中建立治理稽核日誌表...`);

        const newSheet = await client.createDatasheet(TARGET_SPACE_ID, {
            name: '治理稽核 - 事件日誌',
            description: '記錄 OmniCore 治理引擎產生的所有治理事件，符合 5T 可追溯性要求',
            fields: [
                { name: 'Event_ID', type: 'SingleText' },      // UUID v4
                {
                    name: 'Event_Type',
                    type: 'SingleSelect',
                    property: {
                        options: [
                            { name: 'ADR_CREATED', color: 'blue' },
                            { name: 'CONTRACT_UPDATED', color: 'teal' },
                            { name: 'POLICY_VIOLATION', color: 'red' },
                            { name: 'SEAL_LOCKED', color: 'purple' },
                            { name: 'AGENT_DISPATCH', color: 'cyan' },
                            { name: 'SYSTEM_HEAL', color: 'green' }
                        ]
                    }
                },
                { name: 'Actor', type: 'SingleText' },          // 執行者（Agent ID 或 User ID）
                { name: 'Target_Resource', type: 'SingleText' }, // 被操作的資源
                { name: 'Description', type: 'Text' },
                {
                    name: 'Severity',
                    type: 'SingleSelect',
                    property: {
                        options: [
                            { name: 'INFO', color: 'gray' },
                            { name: 'WARNING', color: 'yellow' },
                            { name: 'CRITICAL', color: 'red' }
                        ]
                    }
                },
                { name: 'Before_State', type: 'Text' },         // JSON 快照：操作前狀態
                { name: 'After_State', type: 'Text' },          // JSON 快照：操作後狀態
                { name: 'Timestamp', type: 'DateTime' },
                { name: 'Proof_Hash', type: 'SingleText' },     // SHA-256 封印（不可篡改）
                { name: 'ADR_Ref', type: 'SingleText' }         // 關聯 ADR 編號
            ]
        });

        console.log(`✅ 治理稽核日誌表建立成功！ID: ${newSheet.id}`);

        // ── 寫入初始治理事件 ─────────────────────────────────────────────
        console.log(`\n📋 寫入初始治理事件...`);
        const seedData = [
            {
                fields: {
                    'Event_ID': `gov-${Date.now()}-001`,
                    'Event_Type': 'ADR_CREATED',
                    'Actor': 'OmniAgent/Antigravity',
                    'Target_Resource': 'docs/adr/001-use-trpc.md',
                    'Description': '建立 ADR-001：採用 tRPC 實現端到端型別安全的架構決策',
                    'Severity': 'INFO',
                    'Before_State': '{}',
                    'After_State': '{"status":"approved","version":"1.0.0"}',
                    'Timestamp': new Date().toISOString(),
                    'Proof_Hash': '',
                    'ADR_Ref': 'ADR-001'
                }
            },
            {
                fields: {
                    'Event_ID': `gov-${Date.now()}-002`,
                    'Event_Type': 'POLICY_VIOLATION',
                    'Actor': 'CI/CD Pipeline',
                    'Target_Resource': '.mcp/all-mcp-servers.json',
                    'Description': 'GitHub Secret Scanning 偵測到 GCP API Key 洩漏，已自動封鎖 push',
                    'Severity': 'CRITICAL',
                    'Before_State': '{"secrets_exposed":true}',
                    'After_State': '{"secrets_exposed":false,"gitignore_updated":true}',
                    'Timestamp': new Date().toISOString(),
                    'Proof_Hash': '',
                    'ADR_Ref': ''
                }
            }
        ];

        const records = await client.createRecords(newSheet.id, seedData, 'name');
        console.log(`✅ 成功寫入 ${records.length} 筆治理事件！`);
        console.log(`\n👉 下一步：請將以下 ID 貼到 .env.local：\nOMNITABLE_GOVERNANCE_AUDIT_DATASHEET_ID="${newSheet.id}"`);

    } catch (error) {
        console.error('❌ 建立治理稽核日誌表失敗:', error);
    }
}

main();
