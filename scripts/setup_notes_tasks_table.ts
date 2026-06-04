import { getOmniTableServerClient } from '../lib/omni-table/client';

// ============================================================================
// OmniBlueTable 自動化建表腳本：萬能筆記 - 任務同步專案表
// ============================================================================

const TARGET_SPACE_ID = process.env.OMNITABLE_SPACE_ID || 'spc_demo_12345';

async function main() {
    console.log('🚀 開始建立「筆記任務專案表」 OmniTable Datasheet...');
    const client = getOmniTableServerClient();

    try {
        console.log(`\n📦 準備在 Space [${TARGET_SPACE_ID}] 中建立表單 (Schema)...`);

        const newSheet = await client.createDatasheet(TARGET_SPACE_ID, {
            name: '萬能筆記 - 任務管理',
            description: '接收來自 OmniNotes 萬能筆記中勾選為「任務」的項目',
            fields: [
                { name: 'Task Title', type: 'SingleText' },
                {
                    name: 'Status',
                    type: 'SingleSelect',
                    property: {
                        options: [
                            { name: 'Todo', color: 'deepPurple' },
                            { name: 'In Progress', color: 'blue' },
                            { name: 'Done', color: 'green' }
                        ]
                    }
                },
            ]
        });

        console.log(`✅ 任務表單建立成功！\n👉 請將以下 ID 貼到您的 .env 檔案中:\nOMNITABLE_TASKS_DATASHEET_ID="${newSheet.id}"`);
    } catch (error) {
        console.error('❌ 建立任務失敗:', error);
    }
}

main();
