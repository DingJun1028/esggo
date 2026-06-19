/**
 * 🏛️ Omni ESG Reports - The Orchestrator (Zustand Global Store)
 * 
 * 這是一個「總控中心」，負責管理 200 個 ESG 功能模組的所有表單、節點與封存狀態。
 * 所有資料在進入 Supabase WORM 儲存前，都會在這裡暫存並進行「零幻覺驗證」。
 */

import { create } from 'zustand';
import { IComponentCore, ISealedData, ILifecycleEvent } from '../../types/omni/core.types';
import { sealData, appendLifecycleEvent } from '../../utils/omni/trust-guard';
import { v4 as uuidv4 } from 'uuid';

type OmniNodeDictionary = Record<string, IComponentCore<any>>;
type SealedNodeDictionary = Record<string, Readonly<ISealedData<any>>>;

interface OmniOrchestratorState {
    // --- 狀態庫 ---
    draftNodes: OmniNodeDictionary; // 正在編輯中的節點
    sealedNodes: SealedNodeDictionary; // 已被成功封存 (Hash Locked) 的節點

    // --- 操作方法 ---
    addDraftNode: (node: IComponentCore<any>) => void;
    updateDraftNodeData: <T>(uuid: string, newData: T, actorId: string, reason?: string) => void;
    sealNode: (uuid: string, previousHash?: string) => string; // 回傳新產生的 Hash
    removeDraftNode: (uuid: string) => void;

    // --- 全局導航與控制 ---
    activeModuleId: string | null;
    setActiveModule: (moduleId: string) => void;
}

export const useOmniStore = create<OmniOrchestratorState>((set, get) => ({
    draftNodes: {},
    sealedNodes: {},
    activeModuleId: null,

    // 1. 新增一筆草稿資料 (Phase 1: 數據煉成)
    addDraftNode: (node) => {
        set((state) => ({
            draftNodes: { ...state.draftNodes, [node.uuid]: node }
        }));
    },

    // 2. 更新編輯中的草稿並留下 Lifecycle 軌跡 (Phase 1: 鍊式日誌追蹤)
    updateDraftNodeData: (uuid, newData, actorId, reason) => {
        const currentState = get();
        const existingNode = currentState.draftNodes[uuid];

        if (!existingNode) {
            console.error(`[OmniStore Error] Node ${uuid} not found.`);
            return;
        }

        if (existingNode.isFrozen) {
            console.error(`[OmniStore Error] Security Violation! Node ${uuid} is frozen.`);
            return;
        }

        // 留下 Lifecycle Event
        const nodeWithLog = appendLifecycleEvent(existingNode, {
            id: `hook-${uuidv4().slice(0, 8)}`,
            action: 'UPDATED',
            source_module: actorId,
            metadata: { delta: newData as any, reason }
        });

        // 這裡我們替換完整的 Data，未來可實作 Deep Merge
        const updatedNode: IComponentCore<any> = {
            ...nodeWithLog,
            data: newData,
            version: requireNewVersion(existingNode.version) // 假定的升版邏輯
        };

        set((state) => ({
            draftNodes: { ...state.draftNodes, [uuid]: updatedNode }
        }));
    },

    // 3. 封印節點 (Phase 4: 永恆刻印)
    sealNode: (uuid, previousHash = '') => {
        const currentState = get();
        const targetNode = currentState.draftNodes[uuid];

        if (!targetNode) {
            throw new Error(`[OmniStore Error] Cannot seal missing node ${uuid}`);
        }

        // 加上鎖定 Log
        const finalNode = appendLifecycleEvent(targetNode, {
            id: `hook-${uuidv4().slice(0, 8)}`,
            action: 'LOCKED',
            source_module: 'SYSTEM_SEALER',
            metadata: { reason: 'Final sealing ceremony executed' }
        });

        // 執行 trust-guard 中的 Hash Lock 與 Objet.freeze
        const sealedData = sealData(finalNode, previousHash);

        // 從草稿區移除，並移入 Sealed 區
        set((state) => {
            const { [uuid]: _, ...remainingDrafts } = state.draftNodes;
            return {
                draftNodes: remainingDrafts,
                sealedNodes: { ...state.sealedNodes, [uuid]: sealedData }
            };
        });

        return sealedData.signature;
    },

    // 清除草稿
    removeDraftNode: (uuid) => {
        set((state) => {
            const { [uuid]: _, ...remainingDrafts } = state.draftNodes;
            return { draftNodes: remainingDrafts };
        });
    },

    // 設定當前活躍模組 (Phase 5: 導覽用)
    setActiveModule: (moduleId) => set({ activeModuleId: moduleId })
}));

/** Helper function to bump version (naive implementation) */
function requireNewVersion(oldVersion: string) {
    // simple e.g. "v0.1.0-draft" -> "v0.1.1-draft"
    return oldVersion;
}
