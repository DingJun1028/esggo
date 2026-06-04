"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStore = exports.OmniEventStore = void 0;
const types_1 = require("@/src/shared/types");
const crypto_1 = require("crypto");
const events_1 = require("events");
/**
 * OmniEventStore: 萬能分身事件儲存庫 (GPL - Global Processing Log)
 * 負責事件的創建、雜湊鎖定 (Hash Lock) 與永恆刻印 (靜態調用版)
 */
class OmniEventStore {
    static createEvent(eventType, card, sourcePlatform, cryptographicSeal) {
        // 1. 先透過 Zod 進行規範化 (Normalization)，確保物件結構與類型符合契約
        const normalizedCard = types_1.OmniCardSchema.parse(card);
        // 2. 基於規範化後的物件計算 Hash Lock，避免屬性順序或額外欄位造成的驗證偏移
        const payloadString = JSON.stringify(normalizedCard);
        const hashLock = (0, crypto_1.createHash)('sha256').update(payloadString).digest('hex');
        const rawEvent = {
            id: (0, crypto_1.randomUUID)(),
            omni_card_uuid: normalizedCard.uuid,
            event_type: eventType,
            payload: normalizedCard,
            source_platform: sourcePlatform,
            created_at: Date.now(),
            hash_lock: hashLock,
            cryptographic_seal: cryptographicSeal,
        };
        return types_1.OmniEventSchema.parse(rawEvent);
    }
    static async saveEvent(event) {
        console.log(`[OmniEventStore] Event engraved in GPL. Hash: ${event.hash_lock}`);
        if (event.cryptographic_seal) {
            console.log(`[OmniEventStore] ZKP Seal attached: ${event.cryptographic_seal}`);
        }
        // Broadcast the event via the event bus to drive reactive UI streams or memory syncs
        OmniEventStore.eventBus.emit('event_saved', event);
        return Promise.resolve();
    }
}
exports.OmniEventStore = OmniEventStore;
OmniEventStore.eventBus = new events_1.EventEmitter();
/**
 * EventStore: 萬能分身事件儲存庫 (實例版，支援重播與自癒)
 */
class EventStore extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.events = [];
    }
    async appendEvent(cardUuid, eventType, card, sourcePlatform, cryptographicSeal) {
        const event = OmniEventStore.createEvent(eventType, card, sourcePlatform, cryptographicSeal);
        this.events.push(event);
        this.emit('event_appended', event);
    }
    rebuildTruthState(cardUuid) {
        const cardEvents = this.events
            .filter(e => e.omni_card_uuid === cardUuid)
            .sort((a, b) => a.created_at - b.created_at);
        if (cardEvents.length === 0) {
            return null;
        }
        // 強化異步事件流的回溯穩定性：過濾掉 Hash Lock 不符的損壞事件 (5T: Trustworthy)
        const validEvents = cardEvents.filter(e => {
            const payloadString = JSON.stringify(e.payload);
            const expectedHash = (0, crypto_1.createHash)('sha256').update(payloadString).digest('hex');
            if (e.hash_lock !== expectedHash) {
                console.warn(`[EventStore] 檢測到損壞的事件 ${e.id}，Hash Lock 驗證失敗。`);
                return false;
            }
            return true;
        });
        if (validEvents.length === 0) {
            return null;
        }
        // Last-Write-Wins (LWW) 取最後一筆經過驗證的真理狀態
        return validEvents[validEvents.length - 1].payload;
    }
    getEvents(cardUuid) {
        return this.events.filter(e => e.omni_card_uuid === cardUuid);
    }
}
exports.EventStore = EventStore;
//# sourceMappingURL=event-store.js.map