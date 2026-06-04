// Core Principles for OmniAgent (通原則核心)
import { T5_PRINCIPLES } from './T5Core/principles';
export var Principle;
(function (Principle) {
    Principle["Truth"] = "Truth";
    Principle["Goodness"] = "Goodness";
    Principle["Beauty"] = "Beauty";
    Principle["Trust"] = "Trust";
})(Principle || (Principle = {}));
export const Principles = {
    [Principle.Truth]: {
        description: '確保每筆資料不可篡改，使用 Hash Lock 與原始碼鎖定',
        impact: 10,
        t5Principle: T5_PRINCIPLES.TRACEABLE
    },
    [Principle.Goodness]: {
        description: '公開透明演算，標註 ISO 與公式來源，消除 AI 幻覺',
        impact: 8,
        t5Principle: T5_PRINCIPLES.TRANSPARENT
    },
    [Principle.Beauty]: {
        description: '液態玻璃 UI 以視覺回饋呈現數據健康度，提升可用性',
        impact: 6,
        t5Principle: T5_PRINCIPLES.TANGIBLE
    },
    [Principle.Trust]: {
        description: '週期性自動修復與 Refactoring，降低熵值，保證系統永續',
        impact: 9,
        t5Principle: T5_PRINCIPLES.TRUSTWORTHY
    },
};
/**
 * 取得某原則的描述
 */
export function getPrincipleDescription(p) {
    return Principles[p].description;
}
/**
 * 匹配 URN 或比例 0-1 的值，若超出則返回 null
 */
export function clampFactor(value) {
    if (value < 0 || value > 1)
        return null;
    return value;
}
/**
 * 檢查是否所有必備部件已實作
 */
export function validateCorePresence(core) {
    if (typeof core !== 'object' || core === null)
        return false;
    const c = core;
    return typeof c.uuid === 'string' && typeof c.hash_lock === 'string';
}
const CorePrinciples = { Principle, Principles, getPrincipleDescription, clampFactor, validateCorePresence };
export default CorePrinciples;
//# sourceMappingURL=CorePrinciples.js.map