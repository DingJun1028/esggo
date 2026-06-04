import { OmniCard, OmniEvent } from '@/src/shared/types';
import { EventEmitter } from 'events';
/**
 * OmniEventStore: 萬能分身事件儲存庫 (GPL - Global Processing Log)
 * 負責事件的創建、雜湊鎖定 (Hash Lock) 與永恆刻印 (靜態調用版)
 */
export declare class OmniEventStore {
    static readonly eventBus: EventEmitter<[never]>;
    static createEvent(eventType: string, card: OmniCard, sourcePlatform: string, cryptographicSeal?: string): OmniEvent;
    static saveEvent(event: OmniEvent): Promise<void>;
}
/**
 * EventStore: 萬能分身事件儲存庫 (實例版，支援重播與自癒)
 */
export declare class EventStore extends EventEmitter {
    private events;
    appendEvent(cardUuid: string, eventType: string, card: OmniCard, sourcePlatform: string, cryptographicSeal?: string): Promise<void>;
    rebuildTruthState(cardUuid: string): OmniCard | null;
    getEvents(cardUuid: string): OmniEvent[];
}
//# sourceMappingURL=event-store.d.ts.map