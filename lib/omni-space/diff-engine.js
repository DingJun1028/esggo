"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateDiffEngine = void 0;
/**
 * 狀態對比演算法核心 (Diff Engine)
 * 實現硬制定的數據差異優先順序
 */
class StateDiffEngine {
    /**
     * 比較真理狀態與外部快照，返回精確的差異結果
     * 優先順序硬制定：
     * 1. CRITICAL: 狀態 (status) 不一致
     * 2. HIGH: 核心屬性 (attributes/abilities) 數量或內容不一致
     * 3. LOW: 名稱 (name) 等文案欄位不一致
     */
    static compare(truth, snapshot) {
        const differences = {};
        let severity = 'NONE';
        // 1. 比較狀態 (CRITICAL)
        if (truth.status !== snapshot.status) {
            differences.status = { truth: truth.status, snapshot: snapshot.status };
            severity = 'CRITICAL';
        }
        // 2. 比較陣列型屬性 (HIGH)
        // 陣列比較：檢查長度與元素內容 (無視順序)
        const truthAttrStr = [...truth.attributes].sort().join(',');
        const snapAttrStr = [...snapshot.attributes].sort().join(',');
        if (truthAttrStr !== snapAttrStr) {
            differences.attributes = { truth: truth.attributes, snapshot: snapshot.attributes };
            severity = Math.max(this.severityWeight(severity), this.severityWeight('HIGH')) === this.severityWeight('HIGH') ? 'HIGH' : severity;
        }
        const truthAbilStr = [...truth.abilities].sort().join(',');
        const snapAbilStr = [...snapshot.abilities].sort().join(',');
        if (truthAbilStr !== snapAbilStr) {
            differences.abilities = { truth: truth.abilities, snapshot: snapshot.abilities };
            severity = Math.max(this.severityWeight(severity), this.severityWeight('HIGH')) === this.severityWeight('HIGH') ? 'HIGH' : severity;
        }
        // 3. 比較文案欄位 (LOW)
        if (truth.name !== snapshot.name) {
            differences.name = { truth: truth.name, snapshot: snapshot.name };
            severity = Math.max(this.severityWeight(severity), this.severityWeight('LOW')) === this.severityWeight('LOW') ? 'LOW' : severity;
        }
        return {
            isAligned: Object.keys(differences).length === 0,
            differences,
            severity
        };
    }
    static severityWeight(sev) {
        switch (sev) {
            case 'CRITICAL': return 3;
            case 'HIGH': return 2;
            case 'LOW': return 1;
            case 'NONE': return 0;
        }
    }
}
exports.StateDiffEngine = StateDiffEngine;
//# sourceMappingURL=diff-engine.js.map