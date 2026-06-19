import { useState, useCallback } from 'react';
import { useOmniStore } from '../../store/omni/orchestrator';
import { IComponentCore } from '../../types/omni/core.types';
import { createGenesisNode } from '../../utils/omni/trust-guard';

/**
 * 🔒 Omni ESG Reports - Data Core Hook (The Genesis Tools)
 * 
 * 這是一個 React Custom Hook，專門提供給 UI 元件呼叫。
 * 封裝了「產生新資料」、「雜湊簽章(Seal)」、「鎖定檢查」等繁雜的密碼學邏輯。
 * 讓 UI 層只需要呼叫 `createNode(formData)` 就完成了 5T 真實性擔保。
 */
export function useOmniDataCore() {
    const {
        draftNodes,
        sealedNodes,
        addDraftNode,
        updateDraftNodeData,
        sealNode,
        removeDraftNode
    } = useOmniStore();

    const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

    /**
     * 建立創世草稿節點
     */
    const initiateDraft = useCallback(<T>(initialData: T, originRef: string, creatorId: string = 'SYSTEM_AGENT') => {
        // 透過 trust-guard 產生包含 uuid, version, timestamp, 和初始 Hash 的安全物件
        const newNode = createGenesisNode(initialData, originRef, 'Manual', creatorId);

        // 注入總控中心
        addDraftNode(newNode);
        setActiveDraftId(newNode.uuid);

        return newNode.uuid;
    }, [addDraftNode]);

    /**
     * 更新草稿內容 (並自動在背後留下 Lifecycle 鍊式日誌)
     */
    const saveDraft = useCallback(<T>(uuid: string, data: T, actorId: string = 'SYSTEM_AGENT', logReason: string = 'Auto-Save') => {
        try {
            updateDraftNodeData(uuid, data, actorId, logReason);
            return true;
        } catch (e) {
            console.error('Failed to update draft', e);
            return false;
        }
    }, [updateDraftNodeData]);

    /**
     * 執行封存儀式 (Hash Lock + Deep Freeze)
     */
    const finalizeAndSeal = useCallback((uuid: string, prevChainHash: string = '') => {
        try {
            // sealNode 會拋出 signature
            const finalSignature = sealNode(uuid, prevChainHash);
            if (activeDraftId === uuid) {
                setActiveDraftId(null);
            }
            return finalSignature;
        } catch (e) {
            console.error('Data sealing failed!', e);
            return null;
        }
    }, [sealNode, activeDraftId]);

    return {
        draftNodes,
        sealedNodes,
        activeDraftId,
        setActiveDraftId,
        initiateDraft,
        saveDraft,
        finalizeAndSeal,
        removeDraftNode
    };
}
