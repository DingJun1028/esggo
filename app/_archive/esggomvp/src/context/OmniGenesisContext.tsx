"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { omniLogger, LogCategory } from '@/core/omniLogger';

/**
 * 🏛️ OmniGenesisContext - The Universal Source (Principle 1)
 * 
 * 這是全域系統的「能量源」，負責統一身份認證、數位分身狀態與全域維度感官。
 */

export type OmniDimension = 'E' | 'S' | 'G' | 'Agent' | 'Hub';

interface OmniGenesisState {
    user: any;
    agentTwin: {
        nickname: string | null;
        nature_law: string | null;
        resonance_level: number;
        status: 'Unborn' | 'Resonating' | 'Ascended';
    };
    dimension: OmniDimension;
    isResonating: boolean;
    omniMemoryStatus: 'Sleeping' | 'Awakening' | 'Fully_Awakened';
    setDimension: (dim: OmniDimension) => void;
    setResonating: (val: boolean) => void;
    syncTwin: (data: any) => void;
}

const OmniGenesisContext = createContext<OmniGenesisState | undefined>(undefined);

export function OmniGenesisProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [dimension, setDimension] = useState<OmniDimension>('Hub');
    const [isResonating, setResonating] = useState(false);
    const [omniMemoryStatus, setOmniMemoryStatus] = useState<'Sleeping' | 'Awakening' | 'Fully_Awakened'>('Sleeping');

    const [agentTwin, setAgentTwin] = useState<OmniGenesisState['agentTwin']>({
        nickname: null,
        nature_law: null,
        resonance_level: 0,
        status: 'Unborn',
    });

    // 當 Session 載入或變更時，自動日誌記錄 (萬物歸宗)
    useEffect(() => {
        if (session?.user) {
            omniLogger.info(LogCategory.SYSTEM, 'OmniGenesis Identity Unified', {
                user: session.user.email,
                t: Date.now()
            });

            // 模擬從資料庫載入 Digital Twin 狀態
            // 未來應從 ncb-service 獲取數據
            const savedTwin = localStorage.getItem('omni_twin');
            if (savedTwin) {
                try {
                    const parsed = JSON.parse(savedTwin);
                    setAgentTwin({
                        ...parsed,
                        status: 'Resonating'
                    });
                } catch (e) {
                    omniLogger.error(LogCategory.SYSTEM, 'Failed to parse twin from storage', e);
                }
            }
        }
    }, [session]);

    const syncTwin = (data: any) => {
        setAgentTwin(prev => ({ ...prev, ...data }));
        localStorage.setItem('omni_twin', JSON.stringify({ ...agentTwin, ...data }));
    };

    const value: OmniGenesisState = {
        user: session?.user ?? null,
        agentTwin,
        dimension,
        isResonating,
        omniMemoryStatus,
        setDimension,
        setResonating,
        syncTwin,
    };


    return (
        <OmniGenesisContext.Provider value={value}>
            {children}
        </OmniGenesisContext.Provider>
    );
}

export function useOmniGenesis() {
    const context = useContext(OmniGenesisContext);
    if (context === undefined) {
        throw new Error('useOmniGenesis must be used within an OmniGenesisProvider');
    }
    return context;
}
