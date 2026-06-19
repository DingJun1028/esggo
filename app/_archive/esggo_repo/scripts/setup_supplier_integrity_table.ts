import { getOmniTableServerClient } from '../lib/omni-table/client';

// ============================================================================
// OmniBlueTable 自動化建表腳本：供應鏈誠信評估表
// 對應模組：lib/supplier-integrity-engine.ts
// ============================================================================

const TARGET_SPACE_ID = process.env.OMNITABLE_SPACE_ID || 'spc_demo_12345';

export default async function main() {
    console.log('🚀 開始建立「供應鏈誠信評估表」OmniTable Datasheet...');
    const client = getOmniTableServerClient();

    try {
        console.log(`\n📦 準備在 Space [${TARGET_SPACE_ID}] 中建立供應商評估表...`);

        const newSheet = await client.createDatasheet(TARGET_SPACE_ID, {
            name: '供應鏈誠信 - 評估庫',
            description: '供應商 ESG 誠信評估資料，由 SupplierIntegrityEngine 自動化建立',
            fields: [
                { name: 'Supplier_ID', type: 'SingleText' },
                { name: 'Supplier_Name', type: 'SingleText' },
                { name: 'Country', type: 'SingleText' },
                { name: 'Industry', type: 'SingleText' },
                {
                    name: 'Tier',
                    type: 'SingleSelect',
                    property: {
                        options: [
                            { name: 'Tier-1', color: 'red' },
                            { name: 'Tier-2', color: 'orange' },
                            { name: 'Tier-3', color: 'yellow' }
                        ]
                    }
                },
                { name: 'ESG_Score', type: 'Number' },
                { name: 'Carbon_Footprint_tCO2e', type: 'Number' },
                {
                    name: 'Integrity_Status',
                    type: 'SingleSelect',
                    property: {
                        options: [
                            { name: 'Verified', color: 'green' },
                            { name: 'Under Review', color: 'yellow' },
                            { name: 'Suspended', color: 'red' }
                        ]
                    }
                },
                { name: 'Last_Audit_Date', type: 'SingleText' },
                { name: 'Next_Audit_Date', type: 'SingleText' },
                { name: 'Risk_Flags', type: 'Text' },
                { name: 'Certifications', type: 'Text' },
                { name: 'Contact_Email', type: 'Email' },
                { name: 'Proof_Hash', type: 'SingleText' }
            ]
        });

        console.log(`✅ 供應商誠信評估表建立成功！ID: ${newSheet.id}`);

        const seedData = [
            {
                fields: {
                    'Supplier_ID': 'SUP-TW-001',
                    'Supplier_Name': '台灣精密零件股份有限公司',
                    'Country': 'TW',
                    'Industry': '製造業 - 精密機械',
                    'Tier': 'Tier-1',
                    'ESG_Score': 78,
                    'Carbon_Footprint_tCO2e': 1250,
                    'Integrity_Status': 'Verified',
                    'Last_Audit_Date': '2026-01-15',
                    'Next_Audit_Date': '2026-07-15',
                    'Risk_Flags': '[]',
                    'Certifications': 'ISO-14001, ISO-9001',
                    'Contact_Email': 'esg@tpcomp.com.tw',
                    'Proof_Hash': ''
                }
            },
            {
                fields: {
                    'Supplier_ID': 'SUP-VN-002',
                    'Supplier_Name': 'Vietnam Supply Chain Co.',
                    'Country': 'VN',
                    'Industry': '製造業 - 電子零件',
                    'Tier': 'Tier-2',
                    'ESG_Score': 52,
                    'Carbon_Footprint_tCO2e': 3800,
                    'Integrity_Status': 'Under Review',
                    'Last_Audit_Date': '2025-09-01',
                    'Next_Audit_Date': '2026-03-01',
                    'Risk_Flags': '["LABOR_RISK","HIGH_CARBON"]',
                    'Certifications': '',
                    'Contact_Email': 'compliance@vnsupply.com',
                    'Proof_Hash': ''
                }
            }
        ];

        const records = await client.createRecords(newSheet.id, seedData, 'name');
        console.log(`✅ 成功寫入 ${records.length} 筆供應商資料！`);
        console.log(`\n👉 請將以下 ID 貼到 .env.local：\nOMNITABLE_SUPPLIER_INTEGRITY_DATASHEET_ID="${newSheet.id}"`);

    } catch (error) {
        console.error('❌ 建立供應鏈誠信評估表失敗:', error);
    }
}

if (require.main === module) {
    main();
}
