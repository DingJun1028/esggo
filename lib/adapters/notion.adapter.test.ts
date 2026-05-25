import { expect, test, describe } from 'vitest';
import { NotionAdapter } from './notion.adapter';
import { NotionPagePayload } from '../../types/omni-card';

describe('NotionAdapter (JunAIKey 協同驗證)', () => {
  test('應能將合法的 Notion Payload 提純為 OmniCard', () => {
    const payload: NotionPagePayload = {
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

    const card = NotionAdapter.transform(payload);

    // Traceable (溯源性)
    expect(card.uuid).toBeDefined();
    expect(typeof card.uuid).toBe('string');
    
    // Transparent & Tangible (驗算與具體屬性)
    expect(card.name).toBe('Implement OmniSpace');
    expect(card.status).toBe('doing');
    expect(card.attributes).toEqual(['Fire', 'Water']);
    expect(card.abilities).toEqual(['Sync', 'Transform']);
    
    // Trackable (追蹤性)
    expect(card.lastUpdated).toBe(new Date('2026-05-26T12:00:00.000Z').getTime());
  });

  test('當遇到未知 Status 時，應回退(Fallback)至 todo', () => {
    const payload: NotionPagePayload = {
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

    const card = NotionAdapter.transform(payload);
    expect(card.status).toBe('todo'); // 確保防禦性邏輯生效
  });
});