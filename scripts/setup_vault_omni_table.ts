import { getOmniTableServerClient } from '../lib/omni-table/client';

// ============================================================================
// OmniBlueTable 自動化建表腳本：Vault Omni 封存庫索引表
// 對應模組：lib/vault-omni.ts / lib/crypto-proof.ts
// ============================================================================

const TARGET_SPACE_ID = process.env.OMNITABLE_SPACE_ID || 'spc_demo_12345';

export default async function main() {
    console.log('🚀 開始建立「Vault Omni 封存庫索引」OmniTable Datasheet...');
    const client = getOmniTableServerClient();

    try {
        console.log(`\n📦 準備在 Space [${TARGET_SPACE_ID}] 中建立 Vault 索引表...`);

        const newSheet = await client.createDatasheet(TARGET_SPACE_ID, {
            name: 'Vault Omni - 封存索引庫',
            description: '5T 資料封存庫的可視化索引，記錄所有已 Hash Lock 封印的資料資產',
            fields: [
                { name: 'Atom_ID', type: 'SingleText' },       // UUID v4
                { name: 'Asset_Name', type: 'SingleText' },
                {
                    name: 'Asset_Type',
                    type: 'SingleSelect',
                    property: {
                        options: [
                            { name: 'ESG_REPORT', color: 'green' },
                            { name: 'CARBON_DATA', color: 'teal' },
                            { name: 'COMPLIANCE_RECORD', color: 'blue' },
                            { name: 'GOVERNANCE_EVENT', color: 'purple' },
                            { name: 'SUPPLIER_AUDIT', color: 'orange' },
                            { name: 'AI_EVIDENCE', color: 'cyan' }
                        ]
                    }
                },
                { name: 'Source_Origin', type: 'SingleText' }, // 資料來源模組
                { name: 'Version', type: 'SingleText' },
                { name: 'SHA256_Hash', type: 'SingleText' },   // 不可篡改封印
                {
                    name: 'Seal_Status',
                    type: 'SingleSelect',
                    property: {
                        options: [
                            { name: 'SEALED', color: 'purple' },
                            { name: 'PENDING', color: 'yellow' },
                            { name: 'REVOKED', color: 'red' }
                        ]
                    }
                },
                { name: 'Impact_Metric', type: 'SingleText' },
                { name: 'Sealed_At', type: 'DateTime' },
                { name: 'Expires_At', type: 'SingleText' },
                { name: 'Ref_URL', type: 'URL' }              // 原始資料連結
            ]
        });

        console.log(`✅ Vault Omni 索引表建立成功！ID: ${newSheet.id}`);

        const seedData = [
            {
                fields: {
                    'Atom_ID': `atom-${Date.now()}-001`,
                    'Asset_Name': 'ESGGO 2025 年度永續報告書',
                    'Asset_Type': 'ESG_REPORT',
                    'Source_Origin': 'OmniNexus/forge_gri_report',
                    'Version': '2.0.0',
                    'SHA256_Hash': 'a1b2c3d4e5f6...',
                    'Seal_Status': 'SEALED',
                    'Impact_Metric': 'GRI 305-1 直接排放 1,200 tCO2e',
                    'Sealed_At': new Date().toISOString(),
                    'Expires_At': '2027-12-31',
                    'Ref_URL': 'https://esggo.app/vault/report-2025'
                }
            }
        ];

        const records = await client.createRecords(newSheet.id, seedData, 'name');
        console.log(`✅ 成功寫入 ${records.length} 筆 Vault 索引記錄！`);
        console.log(`\n👉 請將以下 ID 貼到 .env.local：\nOMNITABLE_VAULT_OMNI_DATASHEET_ID="${newSheet.id}"`);

    } catch (error) {
        console.error('❌ 建立 Vault Omni 索引表失敗:', error);
    }
}

if (require.main === module) {
    main();
}
