import { useState, useEffect, useCallback } from 'react';
import { IInfoOneTrinity, ITrinityService } from '../core/types/InfoOne.types.ts';
import { serviceRegistry } from '../../1-service/ServiceRegistry.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';

/**
 * 🦋 useTrinity Hook
 * --------------------------------------------------
 * [TC] 奧秘三位一體 React Hook，提供對 Trinity 資產的統一存取與反應式更新。
 * [EN] Omni Trinity Hook for unified access and reactive updates to Trinity assets.
 * 
 * @param serviceName 服務名稱 (e.g., 'documentIntelligence', 'socialEconomy')
 * @param assetId 可選的資產 ID (若不提供，則嘗試獲取預設或所有資產)
 */
export function useTrinity(serviceName: string, assetId?: string) {
    const [trinity, setTrinity] = useState<IInfoOneTrinity | null>(null);
    const [allTrinities, setAllTrinities] = useState<IInfoOneTrinity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTrinity = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // 從註冊處獲取服務
            const service = serviceRegistry.get<any>(serviceName);

            if (!service) {
                throw new Error(`Service '${serviceName}' not found in registry.`);
            }

            // 檢查是否符合 ITrinityService 介面
            const trinityService = service as unknown as ITrinityService;

            if (typeof trinityService.getTrinity !== 'function') {
                throw new Error(`Service '${serviceName}' does not implement ITrinityService.`);
            }

            if (assetId) {
                // 獲取特定資產
                const result = await trinityService.getTrinity(assetId);
                setTrinity(result);
            } else if (typeof trinityService.getAllTrinities === 'function') {
                // 獲取所有資產
                const results = await trinityService.getAllTrinities();
                setAllTrinities(results);
                if (results.length > 0) {
                    setTrinity(results[0]);
                } else {
                    setTrinity(null);
                }
            } else {
                omniLogger.warn(LogCategory.SYSTEM, `[useTrinity] No assetId provided and '${serviceName}' lacks getAllTrinities.`);
            }

        } catch (err: any) {
            const msg = err.message || 'Unknown Trinity Error';
            setError(msg);
            omniLogger.error(LogCategory.SYSTEM, `[useTrinity] Error fetching from ${serviceName}:`, { error: msg });
        } finally {
            setLoading(false);
        }
    }, [serviceName, assetId]);

    useEffect(() => {
        fetchTrinity();
    }, [fetchTrinity]);

    /** 🔒 鎖定資產 (封印存檔) */
    const seal = useCallback(() => {
        if (trinity && !trinity.isLocked()) {
            trinity.lock();
            setTrinity({ ...trinity }); // 觸發重新渲染
            omniLogger.info(LogCategory.SYSTEM, `[useTrinity] Asset ${trinity.uuid} sealed via hook.`);
        }
    }, [trinity]);

    return {
        trinity,
        allTrinities,
        loading,
        error,
        refresh: fetchTrinity,
        seal
    };
}
