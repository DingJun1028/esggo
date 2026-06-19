"use client";

import { useEffect, useCallback, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { useEternalMemory, WorldState } from "@/hooks/use-eternal-memory-store";

/**
 * useOmniTelepathy
 * 
 * 萬能心電感應 - 實時雲端同步
 * 透過 Firestore 將 Zustand 的 WorldState 進行跨設備與跨會話的實時共鳴。
 */
export function useOmniTelepathy() {
    const {
        worldLevel,
        heroName,
        isAwakened,
        artifacts,
        activePersonaId,
        dataIntegrityPoints,
        complianceTokens,
        tenantId
    } = useEternalMemory();

    const isSyncingRef = useRef(false);

    // 當前本地的世界法則快照
    const currentLocalState: WorldState = {
        worldLevel,
        heroName,
        isAwakened,
        artifacts,
        activePersonaId,
        dataIntegrityPoints,
        complianceTokens,
        tenantId
    };

    /**
     * 銘刻至雲端 (Outbound Sync) - Tenant Isolated Path
     */
    const engraveToCloud = useCallback(async (uid: string, tid: string, state: WorldState) => {
        if (isSyncingRef.current) return;

        try {
            // Path: tenants/{tenantId}/omni_memory/{userId}
            const docRef = doc(db, "tenants", tid, "omni_memory", uid);
            await setDoc(docRef, state, { merge: true });
            console.log(`📡 [心電感應] 雲端記憶已更新 (租戶: ${tid})。`);
        } catch (error) {
            console.error("❌ [心電感應] 雲端銘刻失敗:", error);
        }
    }, []);

    // 監聽本地 Zustand 變化並同步至 Firestore (Debounced)
    useEffect(() => {
        const user = auth.currentUser;
        if (!user || !isAwakened) return;

        const timeoutId = setTimeout(() => {
            engraveToCloud(user.uid, tenantId, currentLocalState);
        }, 2000); // 2秒防抖

        return () => clearTimeout(timeoutId);
    }, [currentLocalState, isAwakened, tenantId, engraveToCloud]);

    /**
     * 從雲端喚回 (Inbound Sync) - Tenant Isolated Path
     */
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, "tenants", tenantId, "omni_memory", user.uid);

        // 建立實時連線
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const remoteState = docSnap.data() as WorldState;

                // 檢查是否需要同步
                const localStr = JSON.stringify(currentLocalState);
                const remoteStr = JSON.stringify(remoteState);

                if (remoteStr !== localStr) {
                    console.log("🧠 [心電感應] 接收到租戶遠端心意，正在同步本地記憶...");
                    isSyncingRef.current = true;

                    useEternalMemory.setState(remoteState);

                    setTimeout(() => {
                        isSyncingRef.current = false;
                    }, 500);
                }
            }
        });

        return () => unsubscribe();
    }, [currentLocalState, tenantId]);

    return { isTelepathyActive: !!auth.currentUser, currentTenant: tenantId };
}
