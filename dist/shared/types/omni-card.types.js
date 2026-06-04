"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniEventSchema = exports.OmniCardSchema = void 0;
const zod_1 = require("zod");
/**
 * OmniCard: 萬能分身核心原子單位契約
 * 遵循 5T 協議（Traceable, Transparent, Tangible, Trackable, Trustworthy）
 */
exports.OmniCardSchema = zod_1.z.object({
    uuid: zod_1.z.string().uuid().describe('唯一事件溯源 ID (Traceable)'),
    name: zod_1.z.string().min(1).describe('牌名'),
    attributes: zod_1.z.array(zod_1.z.string()).describe('屬性集合 (10 色元素法則)'),
    abilities: zod_1.z.array(zod_1.z.string()).describe('功能模組代碼'),
    status: zod_1.z.enum(['todo', 'doing', 'done']).describe('卡牌狀態'),
    lastUpdated: zod_1.z.number().int().positive().describe('Vector Clock / 時間戳 (Trackable)'),
});
/**
 * OmniEvent: 全域處理日誌 (GPL) 事件契約
 * 實現 Event Sourcing 與 Hash Lock 審查
 */
exports.OmniEventSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().describe('事件唯一 ID'),
    omni_card_uuid: zod_1.z.string().uuid().describe('對應的 OmniCard 溯源 ID'),
    event_type: zod_1.z.string().min(1).describe('事件類型 (e.g., CARD_SYNCED)'),
    payload: exports.OmniCardSchema.describe('轉換後的 OmniCard 資料或增量修改'),
    source_platform: zod_1.z.string().min(1).describe('來源平台 (e.g., Notion)'),
    created_at: zod_1.z.number().int().positive().describe('發生時間戳 (Traceable)'),
    hash_lock: zod_1.z.string().min(64).describe('防篡改哈希鎖 SHA-256 (Trustworthy)'),
    cryptographic_seal: zod_1.z.string().optional().describe('ZKP 零知識證明與密碼學封印 (Trustworthy)'),
});
//# sourceMappingURL=omni-card.types.js.map