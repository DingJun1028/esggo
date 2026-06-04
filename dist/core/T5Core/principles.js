"use strict";
// src/core/T5Core/principles.ts
// T5 Core Principles - ESG Go v8.5.1
// Exported for use in CorePrinciples and validation logic
Object.defineProperty(exports, "__esModule", { value: true });
exports.T5_PRINCIPLES = void 0;
// Define the five T5 principles
exports.T5_PRINCIPLES = {
    TRACEABLE: {
        id: 'T1',
        name: 'Traceable',
        description: '確保每筆資料不可篡改，使用 Hash Lock 與原始碼鎖定，可追溯至來源',
        impact: 10,
        verification: 'Hash chain validation + originCause audit'
    },
    TRANSPARENT: {
        id: 'T2',
        name: 'Transparent',
        description: '公開透明演算，標註 ISO 與公式來源，消除 AI 幻覺，算法開放審查',
        impact: 8,
        verification: 'Formula disclosure + processTrace visibility'
    },
    TANGIBLE: {
        id: 'T3',
        name: 'Tangible',
        description: '液態玻璃 UI 以視覺回饋呈現數據健康度，提升可用性，使抽象數據可感知',
        impact: 6,
        verification: 'UI consistency tests + user feedback metrics'
    },
    TRUSTWORTHY: {
        id: 'T4',
        name: 'Trustworthy',
        description: '週期性自動修復與 Refactoring，降低熵值，保證系統永續，防篡改機制',
        impact: 9,
        verification: 'ZKP seals + integrity scoring + self-healing triggers'
    },
    TRACKABLE: {
        id: 'T5',
        name: 'Trackable',
        description: '生命週期完整追蹤，所有變更皆有審計紀錄，可追蹤至每一個處理節點',
        impact: 7,
        verification: 'processTrace completeness + audit log linkage'
    }
};
exports.default = exports.T5_PRINCIPLES;
//# sourceMappingURL=principles.js.map