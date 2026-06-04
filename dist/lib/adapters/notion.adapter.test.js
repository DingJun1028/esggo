"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const notion_adapter_1 = require("./notion.adapter");
(0, vitest_1.describe)('NotionAdapter (JunAIKey 協同驗證)', () => {
    (0, vitest_1.test)('應能將合法的 Notion Payload 提純為 OmniCard', () => {
        const payload = {
            id: 'notion-uuid-1234',
            url: 'https://notion.so/test',
            last_edited_time: '2026-05-26T12:00:00.000Z',
            properties: {
                Name: {
                    title: [{ plain_text: 'Implement OmniSpace' }],
                },
                Status: {
                    status: { name: 'Doing' },
                },
                Attributes: {
                    multi_select: [{ name: 'Fire' }, { name: 'Water' }],
                },
                Abilities: {
                    multi_select: [{ name: 'Sync' }, { name: 'Transform' }],
                },
            },
        };
        const card = notion_adapter_1.NotionAdapter.transform(payload);
        // Traceable (溯源性)
        (0, vitest_1.expect)(card.uuid).toBeDefined();
        (0, vitest_1.expect)(typeof card.uuid).toBe('string');
        // Transparent & Tangible (驗算與具體屬性)
        (0, vitest_1.expect)(card.name).toBe('Implement OmniSpace');
        (0, vitest_1.expect)(card.status).toBe('doing');
        (0, vitest_1.expect)(card.attributes).toEqual(['Fire', 'Water']);
        (0, vitest_1.expect)(card.abilities).toEqual(['Sync', 'Transform']);
        // Trackable (追蹤性)
        (0, vitest_1.expect)(card.lastUpdated).toBe(new Date('2026-05-26T12:00:00.000Z').getTime());
    });
    (0, vitest_1.test)('當遇到未知 Status 時，應回退(Fallback)至 todo', () => {
        const payload = {
            id: 'notion-uuid-5678',
            url: 'https://notion.so/test2',
            last_edited_time: '2026-05-26T12:00:00.000Z',
            properties: {
                Name: {
                    title: [{ plain_text: 'Unknown Status Task' }],
                },
                Status: {
                    status: { name: 'UnknownState' },
                },
            },
        };
        const card = notion_adapter_1.NotionAdapter.transform(payload);
        (0, vitest_1.expect)(card.status).toBe('todo'); // 確保防禦性邏輯生效
    });
});
//# sourceMappingURL=notion.adapter.test.js.map