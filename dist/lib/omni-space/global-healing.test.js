"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ... (保留原本的 import) ...
const vitest_1 = require("vitest");
const event_store_1 = require("./event-store");
const global_healing_1 = require("./global-healing");
const altable_adapter_1 = require("../adapters/altable.adapter");
const notion_adapter_1 = require("../adapters/notion.adapter");
// Mock Notion 適配器節點
class MockNotionAdapterNode {
    constructor(id, cardUuid, payload) {
        this.platform = 'Notion';
        this.id = id;
        this.cardUuid = cardUuid;
        this.payload = payload;
    }
    async getSnapshot() {
        const card = notion_adapter_1.NotionAdapter.transform(this.payload);
        // 強制重寫 uuid 以與 GPL 溯源識別碼對接
        return { ...card, uuid: this.cardUuid };
    }
    async heal(truthState) {
        // 模擬將真理狀態寫回 Notion 原始屬性結構 (差異撫平)
        this.payload = {
            ...this.payload,
            properties: {
                ...this.payload.properties,
                Name: {
                    title: [{ plain_text: truthState.name }],
                },
                Status: {
                    status: { name: truthState.status === 'doing' ? 'Doing' : truthState.status === 'done' ? 'Done' : 'To Do' },
                },
                Attributes: {
                    multi_select: truthState.attributes.map(attr => ({ name: attr })),
                },
                Abilities: {
                    multi_select: truthState.abilities.map(ab => ({ name: ab })),
                },
            },
            last_edited_time: new Date(truthState.lastUpdated).toISOString(),
        };
    }
}
// Mock AlTable 適配器節點
class MockAlTableAdapterNode {
    constructor(id, cardUuid, payload) {
        this.platform = 'AlTable';
        this.isLocked = false;
        this.id = id;
        this.cardUuid = cardUuid;
        this.payload = payload;
    }
    async getSnapshot() {
        const card = altable_adapter_1.AlTableAdapter.transform(this.payload);
        // 強制重寫 uuid 以與 GPL 溯源識別碼對接
        return { ...card, uuid: this.cardUuid };
    }
    async heal(truthState) {
        if (this.isLocked)
            throw new Error('量子鎖定中，拒絕寫入。');
        // 模擬將真理狀態寫回 AlTable 原始 fields (差異撫平)
        this.payload = {
            ...this.payload,
            fields: {
                ...this.payload.fields,
                Name: truthState.name,
                Status: truthState.status,
                Attributes: truthState.attributes,
                Abilities: truthState.abilities,
            },
            updatedTime: truthState.lastUpdated,
        };
    }
    async lock() {
        this.isLocked = true;
    }
}
// 模擬一個會發生故障的異常適配器節點
class FaultyAdapterNode {
    constructor(cardUuid) {
        this.platform = 'AlTable';
        this.id = 'faulty-record';
        this.cardUuid = cardUuid;
    }
    async getSnapshot() {
        return {
            uuid: this.cardUuid,
            name: 'Faulty Card',
            status: 'todo',
            attributes: [],
            abilities: [],
            lastUpdated: Date.now(),
        };
    }
    async heal(_truthState) {
        throw new Error('API 網路逾時，寫入失敗。');
    }
}
(0, vitest_1.describe)('全域痊癒與調和機制 (Global Healing & GPL Sourcing)', () => {
    let eventStore;
    let healer;
    (0, vitest_1.beforeEach)(() => {
        eventStore = new event_store_1.EventStore();
        healer = new global_healing_1.GlobalHealing(eventStore); // 預設 LV2_AUTO_HEAL
    });
    (0, vitest_1.test)('場景一：正常癒合（一致不處理）', async () => {
        const cardUuid = '11111111-2222-4333-8444-555555555555';
        // 1. 初始化 Notion 原始 payload 並轉換
        const notionPayload = {
            id: 'notion-page-abc',
            url: 'https://notion.so/abc',
            last_edited_time: '2026-05-26T12:00:00.000Z',
            properties: {
                Name: { title: [{ plain_text: 'ESG Report Sync' }] },
                Status: { status: { name: 'Doing' } },
                Attributes: { multi_select: [{ name: 'Environment' }] },
                Abilities: { multi_select: [{ name: 'Carbon Audit' }] },
            },
        };
        const node = new MockNotionAdapterNode('notion-page-abc', cardUuid, notionPayload);
        const snapshot = await node.getSnapshot();
        // 2. 寫入 GPL 作為首筆真理事件
        await eventStore.appendEvent(cardUuid, 'CARD_SYNCED', snapshot, 'Notion');
        // 3. 註冊節點到自癒器中
        healer.registerNode(node);
        // 4. 執行調和
        const result = await healer.applyHealing();
        // 4. 斷言：完全契合，不進行任何修復
        (0, vitest_1.expect)(result.status).toBe('SUCCESS');
        (0, vitest_1.expect)(result.reconciledCount).toBe(0);
        (0, vitest_1.expect)(result.logs.some(log => log.includes('與 GPL 真理狀態完全契合'))).toBe(true);
    });
    (0, vitest_1.test)('場景二：異常撫平（異步資料落後時強制覆寫）', async () => {
        const cardUuid = '99999999-8888-4777-8666-555555555555';
        // 1. GPL 內部事件流：記錄了兩次更新，最新的狀態是 Done (包含最新的碳中和屬性)
        const initialSnapshot = {
            uuid: cardUuid,
            name: 'Carbon Sync Task',
            status: 'todo',
            attributes: ['Carbon'],
            abilities: ['Reduce'],
            lastUpdated: 1774500000000,
        };
        await eventStore.appendEvent(cardUuid, 'CARD_CREATED', initialSnapshot, 'System');
        const truthSnapshot = {
            uuid: cardUuid,
            name: 'Carbon Sync Task (Completed)',
            status: 'done',
            attributes: ['Carbon', 'Verified'],
            abilities: ['Reduce', 'Offset'],
            lastUpdated: 1774600000000,
        };
        // 追加更新事件，此時重播重建的真理狀態應為此最新狀態
        await eventStore.appendEvent(cardUuid, 'CARD_UPDATED', truthSnapshot, 'System');
        // 2. 外部 AlTable 節點的資料落後 (資料偏離，狀態依然是 todo)
        const laggingPayload = {
            recordId: 'rec-lag-123',
            fields: {
                Name: 'Carbon Sync Task',
                Status: 'todo',
                Attributes: ['Carbon'],
                Abilities: ['Reduce'],
            },
            updatedTime: 1774500000000,
        };
        const node = new MockAlTableAdapterNode('rec-lag-123', cardUuid, laggingPayload);
        healer.registerNode(node);
        // 3. 執行差異撫平
        const result = await healer.applyHealing();
        // 4. 斷言：檢測到偏差，並且成功進行修復
        (0, vitest_1.expect)(result.status).toBe('SUCCESS');
        (0, vitest_1.expect)(result.reconciledCount).toBe(1);
        (0, vitest_1.expect)(result.logs.some(log => log.includes('檢測到數據偏差'))).toBe(true);
        (0, vitest_1.expect)(result.logs.some(log => log.includes('差異撫平完成'))).toBe(true);
        // 5. 再次獲取節點 Snapshot，驗證其是否已被拉回與真理狀態完美一致
        const healedSnapshot = await node.getSnapshot();
        (0, vitest_1.expect)(healedSnapshot.status).toBe('done');
        (0, vitest_1.expect)(healedSnapshot.name).toBe('Carbon Sync Task (Completed)');
        (0, vitest_1.expect)(healedSnapshot.attributes).toEqual(['Carbon', 'Verified']);
        (0, vitest_1.expect)(healedSnapshot.abilities).toEqual(['Reduce', 'Offset']);
    });
    (0, vitest_1.test)('場景三：部分失敗與災難性容錯', async () => {
        const cardUuid1 = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
        const cardUuid2 = 'ffffffff-eeee-4ddd-8ccc-bbbbbbbbbbbb';
        // 1. 分別為兩張卡牌在 GPL 中寫入真理狀態
        const truth1 = {
            uuid: cardUuid1,
            name: 'Normal Task',
            status: 'doing',
            attributes: ['E'],
            abilities: ['S'],
            lastUpdated: Date.now(),
        };
        await eventStore.appendEvent(cardUuid1, 'CARD_UPDATED', truth1, 'System');
        const truth2 = {
            uuid: cardUuid2,
            name: 'Faulty Task',
            status: 'done',
            attributes: ['G'],
            abilities: ['G'],
            lastUpdated: Date.now(),
        };
        await eventStore.appendEvent(cardUuid2, 'CARD_UPDATED', truth2, 'System');
        // 2. 註冊一個正常的偏離節點 (AlTable)
        const normalPayload = {
            recordId: 'rec-normal',
            fields: { Name: 'Normal Task', Status: 'todo', Attributes: [], Abilities: [] },
            updatedTime: Date.now() - 10000,
        };
        const normalNode = new MockAlTableAdapterNode('rec-normal', cardUuid1, normalPayload);
        healer.registerNode(normalNode);
        // 3. 註冊一個會發生寫入故障的偏離節點
        const faultyNode = new FaultyAdapterNode(cardUuid2);
        healer.registerNode(faultyNode);
        // 4. 執行調和
        const result = await healer.applyHealing();
        // 5. 斷言：狀態應為 PARTIAL，成功修復 1 個，失敗 1 個
        (0, vitest_1.expect)(result.status).toBe('PARTIAL');
        (0, vitest_1.expect)(result.reconciledCount).toBe(1);
        (0, vitest_1.expect)(result.logs.some(log => log.includes('API 網路逾時，寫入失敗。'))).toBe(true);
        // 6. 正常節點仍需被成功修復
        const finalNormalSnapshot = await normalNode.getSnapshot();
        (0, vitest_1.expect)(finalNormalSnapshot.status).toBe('doing');
    });
    (0, vitest_1.test)('場景四：量子鎖住機制 (LV3_QUANTUM_LOCK)', async () => {
        const lockHealer = new global_healing_1.GlobalHealing(eventStore, 'LV3_QUANTUM_LOCK');
        const cardUuid = '22222222-3333-4444-8555-666666666666';
        const truth = {
            uuid: cardUuid,
            name: 'Critical Task',
            status: 'done', // GPL 狀態已完成
            attributes: ['C'],
            abilities: ['D'],
            lastUpdated: Date.now(),
        };
        await eventStore.appendEvent(cardUuid, 'CARD_UPDATED', truth, 'System');
        // 終端狀態被惡意或意外竄改回 todo (狀態不符 -> CRITICAL 差異)
        const criticalPayload = {
            recordId: 'rec-critical',
            fields: { Name: 'Critical Task', Status: 'todo', Attributes: ['C'], Abilities: ['D'] },
            updatedTime: Date.now(),
        };
        const criticalNode = new MockAlTableAdapterNode('rec-critical', cardUuid, criticalPayload);
        lockHealer.registerNode(criticalNode);
        const result = await lockHealer.applyHealing();
        // 斷言：因為啟動 LV3 且差異為 CRITICAL，該節點應被鎖定且不進行覆寫
        (0, vitest_1.expect)(result.status).toBe('FAILED');
        (0, vitest_1.expect)(result.reconciledCount).toBe(0);
        (0, vitest_1.expect)(result.logs.some(log => log.includes('啟動 LV3 深度防污染鎖定！'))).toBe(true);
        (0, vitest_1.expect)(criticalNode.isLocked).toBe(true);
    });
});
//# sourceMappingURL=global-healing.test.js.map