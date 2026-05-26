import { expect, test, describe, beforeEach } from 'vitest';
import { GlobalHealingService } from './GlobalHealingServer';
import { OmniCard } from '../../../types/omni-card';
import { IAdapterNode } from '../../../lib/omni-space/global-healing';

describe('GlobalHealingService 整合與自癒測試集', () => {
  let service: GlobalHealingService;

  beforeEach(() => {
    // 每次測試初始化全新服務與事件庫，確保測試完全隔離
    service = new GlobalHealingService();
  });

  test('場景一：healCard 動態建立內置記憶體節點並執行自癒', async () => {
    const cardUuid = '11111111-1111-4111-a111-111111111111';

    // 1. 初始化 GPL 真理庫中的真理事件，設定最新真理狀態
    const truthState: OmniCard = {
      uuid: cardUuid,
      name: '碳減排核心指標 (真理版)',
      status: 'done',
      attributes: ['E', 'Carbon'],
      abilities: ['Calculation', 'Reporting'],
      lastUpdated: 1774600000000,
    };
    await service.getEventStore().appendEvent(cardUuid, 'CARD_CREATED', truthState, 'System');

    // 2. 外部節點傳入的偏離卡牌 (資料落後)
    const laggingCard: OmniCard = {
      uuid: cardUuid,
      name: '碳減排指標',
      status: 'todo',
      attributes: ['E'],
      abilities: ['Calculation'],
      lastUpdated: 1774500000000,
    };

    // 3. 呼叫 healCard 進行自癒
    const result = await service.healCard(laggingCard);

    // 4. 驗證自癒成效：確認自癒成功，並將外部落後卡牌原地更新為 GPL 真理狀態
    expect(result.status).toBe('SUCCESS');
    expect(result.reconciledCount).toBe(1);
    expect(laggingCard.name).toBe('碳減排核心指標 (真理版)');
    expect(laggingCard.status).toBe('done');
    expect(laggingCard.attributes).toEqual(['E', 'Carbon']);
    expect(laggingCard.abilities).toEqual(['Calculation', 'Reporting']);

    // 5. 驗證 GPL 事件流中是否正確寫入自癒成功紀錄
    const events = service.getEventStore().getEvents(cardUuid);
    expect(events.length).toBe(2);
    expect(events[1].event_type).toBe('HEALING_APPLIED');
  });

  test('場景二：手動註冊異質外部節點並透過 healAll 撫平差異', async () => {
    const cardUuid = '22222222-2222-4222-a222-222222222222';

    // 1. 設定 GPL 中的真理狀態
    const truthState: OmniCard = {
      uuid: cardUuid,
      name: 'ISO-14064 碳中和確證書',
      status: 'done',
      attributes: ['E', 'Verified'],
      abilities: ['Audit'],
      lastUpdated: Date.now(),
    };
    await service.getEventStore().appendEvent(cardUuid, 'CARD_UPDATED', truthState, 'System');

    // 2. 註冊自訂 Mock 外部適配器節點，其資料落後
    let mockExternalPayload: OmniCard = {
      uuid: cardUuid,
      name: 'ISO-14064 確證草稿',
      status: 'todo',
      attributes: ['E'],
      abilities: [],
      lastUpdated: Date.now() - 50000,
    };

    const mockNode: IAdapterNode = {
      platform: 'AlTable',
      id: 'altable-record-999',
      cardUuid: cardUuid,
      getSnapshot: async () => mockExternalPayload,
      heal: async (truth) => {
        mockExternalPayload = { ...truth };
      }
    };

    service.registerNode(mockNode);

    // 3. 執行全域調和自癒
    const result = await service.healAll();

    // 4. 斷言與驗證
    expect(result.status).toBe('SUCCESS');
    expect(result.reconciledCount).toBe(1);
    expect(mockExternalPayload.name).toBe('ISO-14064 碳中和確證書');
    expect(mockExternalPayload.status).toBe('done');
    expect(mockExternalPayload.attributes).toContain('Verified');
  });

  test('場景三：LV1_MONITOR 等級下，偵測偏離但僅作紀錄、不執行覆寫', async () => {
    const monitorService = new GlobalHealingService(undefined, 'LV1_MONITOR');
    const cardUuid = '33333333-3333-4333-a333-333333333333';

    // GPL 中是已完成狀態
    const truthState: OmniCard = {
      uuid: cardUuid,
      name: '綠色債權申報書',
      status: 'done',
      attributes: ['G'],
      abilities: ['GreenBond'],
      lastUpdated: Date.now(),
    };
    await monitorService.getEventStore().appendEvent(cardUuid, 'CARD_CREATED', truthState, 'System');

    // 外部偏離卡牌 (依然是 todo)
    const laggingCard: OmniCard = {
      uuid: cardUuid,
      name: '綠色債權申報書',
      status: 'todo',
      attributes: ['G'],
      abilities: ['GreenBond'],
      lastUpdated: Date.now() - 1000,
    };

    // 執行自癒調和
    const result = await monitorService.healCard(laggingCard, 'LV1_MONITOR');

    // 因為是 LV1 監控模式，僅作紀錄，不會執行強制自癒覆寫
    expect(result.reconciledCount).toBe(0);
    expect(laggingCard.status).toBe('todo'); // 依舊是 todo

    // GPL 應寫入 HEALING_LOGGED 事件
    const events = monitorService.getEventStore().getEvents(cardUuid);
    expect(events.some(ev => ev.event_type === 'HEALING_LOGGED')).toBe(true);
  });
});
