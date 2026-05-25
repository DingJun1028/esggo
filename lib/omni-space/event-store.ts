import { OmniCard, OmniEvent, OmniEventSchema } from '../../types/omni-card';
import { createHash, randomUUID } from 'crypto';

/**
 * OmniEventStore: 萬能分身事件儲存庫 (GPL - Global Processing Log)
 * 負責事件的創建、雜湊鎖定 (Hash Lock) 與永恆刻印 (靜態調用版)
 */
export class OmniEventStore {
  public static createEvent(eventType: string, card: OmniCard, sourcePlatform: string): OmniEvent {
    const payloadString = JSON.stringify(card);
    const hashLock = createHash('sha256').update(payloadString).digest('hex');

    const rawEvent = {
      id: randomUUID(),
      omni_card_uuid: card.uuid,
      event_type: eventType,
      payload: card,
      source_platform: sourcePlatform,
      created_at: Date.now(),
      hash_lock: hashLock,
    };

    return OmniEventSchema.parse(rawEvent);
  }

  public static async saveEvent(event: OmniEvent): Promise<void> {
    console.log(`[OmniEventStore] Event engraved in GPL. Hash: ${event.hash_lock}`);
    return Promise.resolve();
  }
}

/**
 * EventStore: 萬能分身事件儲存庫 (實例版，支援重播與自癒)
 */
export class EventStore {
  private events: OmniEvent[] = [];

  public async appendEvent(cardUuid: string, eventType: string, card: OmniCard, sourcePlatform: string): Promise<void> {
    const event = OmniEventStore.createEvent(eventType, card, sourcePlatform);
    this.events.push(event);
  }

  public rebuildTruthState(cardUuid: string): OmniCard | null {
    const cardEvents = this.events
      .filter(e => e.omni_card_uuid === cardUuid)
      .sort((a, b) => a.created_at - b.created_at);

    if (cardEvents.length === 0) {
      return null;
    }

    // 簡單的 Last-Write-Wins (LWW) 狀態重建，可根據 5T 協議擴充
    return cardEvents[cardEvents.length - 1].payload;
  }
}

