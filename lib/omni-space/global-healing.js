"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalHealing = void 0;
const diff_engine_1 = require("./diff-engine");
/**
 * GlobalHealing: 萬能心核全域自愈調和器
 * 核心機制遵循 5T 協議門，在資料分歧時進行自動化自愈
 */
class GlobalHealing {
    constructor(eventStore, healingLevel = 'LV2_AUTO_HEAL') {
        this.adapterNodes = [];
        this.eventStore = eventStore;
        this.healingLevel = healingLevel;
    }
    /**
     * 註冊一個適配器節點到調和網路中
     */
    registerNode(node) {
        this.adapterNodes.push(node);
    }
    /**
     * 清除已註冊的節點 (測試隔離輔助)
     */
    clearNodes() {
        this.adapterNodes = [];
    }
    /**
     * 1. 全局掃描：遍歷所有適配器節點，提取當下的卡牌快照 (Tangible)
     */
    async scanAllEntities() {
        const snapshots = new Map();
        for (const node of this.adapterNodes) {
            try {
                const snapshot = await node.getSnapshot();
                snapshots.set(node.cardUuid, snapshot);
            }
            catch (err) {
                const errorMsg = err instanceof Error ? err.message : String(err);
                throw new Error(`[全域掃描失敗] 無法從 ${node.platform} 節點 (${node.id}) 提取快照: ${errorMsg}`);
            }
        }
        return snapshots;
    }
    /**
     * 2. 溯源校驗：讀取 GPL 的事件流，重建該卡牌的「真理狀態」(Truth State)，與終端進行比對 (Traceable)
     */
    async compareWithGPL() {
        const comparison = new Map();
        for (const node of this.adapterNodes) {
            const snapshot = await node.getSnapshot();
            const truth = this.eventStore.rebuildTruthState(node.cardUuid);
            comparison.set(node.cardUuid, { truth, snapshot, node });
        }
        return comparison;
    }
    /**
     * 3. 差異撫平 (Healing)：若終端數據偏離真理狀態，強制呼叫適配器修復，確保資料一致 (Transparent)
     */
    async applyHealing() {
        const logs = [];
        let reconciledCount = 0;
        let failedCount = 0;
        logs.push(`[全域痊癒] 啟動調和自癒機制 (權限等級: ${this.healingLevel})，註冊節點數: ${this.adapterNodes.length}`);
        try {
            const comparison = await this.compareWithGPL();
            for (const [cardUuid, { truth, snapshot, node }] of Array.from(comparison.entries())) {
                let currentTruth = truth;
                // 1. 同步引擎 (Sync Engine)：若 GPL 缺失，以終端快照為準補全溯源鏈
                if (!currentTruth) {
                    logs.push(`[同步補全] 卡牌 ${cardUuid} 在 GPL 中缺乏真理源頭，自動以快照建立初始溯源事件。`);
                    await this.eventStore.appendEvent(cardUuid, 'CARD_CREATED', snapshot, node.platform);
                    currentTruth = snapshot;
                    continue; // 已補全，此時無差異
                }
                // 2. 狀態對比 (Diff Engine)
                const diffResult = diff_engine_1.StateDiffEngine.compare(currentTruth, snapshot);
                if (diffResult.isAligned) {
                    logs.push(`[一致] 與 GPL 真理狀態完全契合，無需撫平。`);
                }
                else {
                    logs.push(`[偏離] 檢測到數據偏差！嚴重程度: ${diffResult.severity}`);
                    logs.push(`  - 差異詳情: ${JSON.stringify(diffResult.differences)}`);
                    // 3. 根據權限等級 (Healing Level) 決定處置策略
                    if (this.healingLevel === 'LV1_MONITOR') {
                        logs.push(`[監控] LV1 模式，僅紀錄差異，不進行自動撫平。`);
                        await this.eventStore.appendEvent(cardUuid, 'HEALING_LOGGED', snapshot, 'Omni-Avatar');
                        continue;
                    }
                    if (this.healingLevel === 'LV3_QUANTUM_LOCK' && diffResult.severity === 'CRITICAL') {
                        logs.push(`[量子鎖住] 檢測到 CRITICAL 衝突！啟動 LV3 深度防污染鎖定！暫停節點寫入權限。`);
                        if (node.lock) {
                            await node.lock();
                        }
                        await this.eventStore.appendEvent(cardUuid, 'QUANTUM_LOCKED', currentTruth, 'Omni-Avatar');
                        failedCount++; // 鎖定視為未能撫平，需人工介入
                        continue;
                    }
                    // LV2 或 LV3 非 CRITICAL 的差異，進行強制修復
                    try {
                        await node.heal(currentTruth);
                        reconciledCount++;
                        logs.push(`[成功] 差異撫平完成！已強制更新 ${node.platform} 節點 (${node.id}) 至真理狀態。`);
                        // 痊癒日誌系統：將「痊癒」過程記錄在 GPL 中
                        await this.eventStore.appendEvent(cardUuid, 'HEALING_APPLIED', currentTruth, 'Omni-Avatar');
                    }
                    catch (error) {
                        failedCount++;
                        const errorMsg = error instanceof Error ? error.message : String(error);
                        logs.push(`[錯誤] 撫平節點 ${node.platform} (${node.id}) 失敗: ${errorMsg}`);
                        await this.eventStore.appendEvent(cardUuid, 'HEALING_FAILED', snapshot, 'Omni-Avatar');
                    }
                }
            }
            let status = 'SUCCESS';
            if (failedCount > 0) {
                status = reconciledCount > 0 ? 'PARTIAL' : 'FAILED';
            }
            logs.push(`[調和結束] 狀態: ${status}, 成功修復節點數: ${reconciledCount}, 失敗節點數: ${failedCount}`);
            return {
                status,
                reconciledCount,
                logs,
            };
        }
        catch (e) {
            logs.push(`[災難性失敗] 全局調和過程中發生未預期錯誤: ${e?.message || e}`);
            return {
                status: 'FAILED',
                reconciledCount: 0,
                logs,
            };
        }
    }
}
exports.GlobalHealing = GlobalHealing;
//# sourceMappingURL=global-healing.js.map