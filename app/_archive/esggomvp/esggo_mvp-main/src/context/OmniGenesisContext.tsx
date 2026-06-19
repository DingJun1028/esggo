"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { omniLogger, LogCategory } from '@/core/omniLogger';
import { IComponentCore } from '@/core/IComponentCore';

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
    ascensionProof: IComponentCore | null;
    heartNetwork: {
        connected: boolean;
        connections: number;
    };
    setDimension: (dim: OmniDimension) => void;
    setResonating: (val: boolean) => void;
    syncTwin: (data: any) => void;
    awakenSystem: () => Promise<void>;
}

const OmniGenesisContext = createContext<OmniGenesisState | undefined>(undefined);

export function OmniGenesisProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [dimension, setDimension] = useState<OmniDimension>('Hub');
    const [isResonating, setResonating] = useState(false);
    const [omniMemoryStatus, setOmniMemoryStatus] = useState<'Sleeping' | 'Awakening' | 'Fully_Awakened'>('Sleeping');
    const [heartNetwork, setHeartNetwork] = useState({ connected: false, connections: 0 });
    const [ascensionProof, setAscensionProof] = useState<IComponentCore | null>(null);

    const [agentTwin, setAgentTwin] = useState<OmniGenesisState['agentTwin']>({
        nickname: null,
        nature_law: null,
        resonance_level: 0,
        status: 'Unborn',
    });

    // 🔄 Sync with Backend Status
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/omni-one');
                const data = await res.json();
                if (data.heartNetwork) {
                    setHeartNetwork(data.heartNetwork);
                    if (data.heartNetwork.connected) {
                        setOmniMemoryStatus('Fully_Awakened');
                    }
                }
            } catch (err) {
                console.error("Failed to fetch OmniOne status:", err);
            }
        };

        fetchStatus();
        const timer = setInterval(fetchStatus, 15000); // Poll every 15s
        return () => clearInterval(timer);
    }, []);

    // 當 Session 載入或變更時，自動日誌記錄 (萬物歸宗)
    useEffect(() => {
        if (session?.user) {
            omniLogger.info(LogCategory.SYSTEM, 'OmniGenesis Identity Unified', {
                user: session.user.email,
                t: Date.now()
            });

            // 模擬從資料庫載入 Digital Twin 狀態
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

    const awakenSystem = async () => {
        setOmniMemoryStatus('Awakening');
        try {
            const res = await fetch('/api/omni-one', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ operation: 'init' })
            });
            const result = await res.json();
            if (result.success) {
                setOmniMemoryStatus('Fully_Awakened');
                setHeartNetwork({ connected: true, connections: 24 });
                if (result.atom) {
                    setAscensionProof(result.atom);
                    omniLogger.info(LogCategory.SYSTEM, "🔒 Ascension Proof Sealed:", result.atom.hash_lock);
                }
            }
        } catch (err) {
            console.error("Awakening failed:", err);
            setOmniMemoryStatus('Sleeping');
        }
    };

    const value: OmniGenesisState = {
        user: session?.user ?? null,
        agentTwin,
        dimension,
        isResonating,
        omniMemoryStatus,
        ascensionProof,
        heartNetwork,
        setDimension,
        setResonating,
        syncTwin,
        awakenSystem,
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
