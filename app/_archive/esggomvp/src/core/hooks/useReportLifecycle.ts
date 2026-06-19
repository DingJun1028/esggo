'use client';

import { useState, useCallback, useEffect } from 'react';
import { IReportMetadata, ReportStatus } from '@/core/types/omni-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 🧬 useReportLifecycle (永續生命週期 Hook)
 * 自動處理資產的初始化、UUID 分發與 5T 溯源日誌。
 */
export const useReportLifecycle = (domain: string) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // 🔐 Auth Integration: Get current user on mount
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                // Try to get user from session/cookie
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const userData = await response.json();
                    if (userData?.user?.id) {
                        setCurrentUserId(userData.user.id);
                    }
                }
            } catch (error) {
                console.log('[Auth] Using default user - not authenticated');
            }
        };
        getCurrentUser();
    }, []);

    /**
     * 建立一個新的資產原子
     */
    const createNewAtom = useCallback((name: string, description: string, ownerId?: string): IReportMetadata => {
        // Use provided ownerId, current user, or fallback to default
        const resolvedOwnerId = ownerId || currentUserId || 'default-user';
        
        return {
            uuid: `atom-${domain.toLowerCase().substring(0, 3)}-${uuidv4().substring(0, 6)}`,
            version: '1.0.0',
            timestamp: Date.now(),
            domain: domain,
            name,
            description,
            status: 'Draft',
            ownerId: resolvedOwnerId,
            tags: [domain],
            evidence: []
        };
    }, [domain, currentUserId]);

    /**
     * 封裝 API 呼叫，紀錄溯源標籤
     */
    const executeWithLog = async (action: () => Promise<any>) => {
        setIsProcessing(true);
        try {
            const result = await action();
            console.log(`[5T:Trackable] ${domain} action executed successfully.`);
            return result;
        } catch (error) {
            console.error(`[5T:Alert] Error in ${domain} lifecycle:`, error);
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        createNewAtom,
        executeWithLog,
        isProcessing
    };
};
