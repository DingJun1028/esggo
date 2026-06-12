'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { ISwarmSyncService } from '../lib/swarm/ISwarmSyncService';
import { WebSocketSwarmSyncService } from '../lib/swarm/WebSocketSwarmSyncService';
import { IOmniRealtimeService } from '../lib/realtime/IOmniRealtimeService';
import { SupabaseOmniRealtimeService } from '../lib/realtime/SupabaseOmniRealtimeService';
import { IntegrityModule } from '../lib/integrity/IntegrityModule';
import { SupabaseIntegrityRepository } from '../lib/integrity/SupabaseIntegrityRepository';
import { ILoggerService } from '../lib/logger/ILoggerService';
import { OmniLoggerService } from '../lib/logger/OmniLoggerService';

// Fallback memory store for offline mode
const memoryIntegrityStore = new Map<string, any>();

class MemoryIntegrityRepository {
    async saveRecord(record: any): Promise<void> {
        memoryIntegrityStore.set(record.id, record);
    }
    async getRecord(id: string): Promise<any | null> {
        return memoryIntegrityStore.get(id) ?? null;
    }
    async verifyHash(id: string, currentHash: string): Promise<boolean> {
        const record = await this.getRecord(id);
        return record?.hash === currentHash;
    }
}

interface ServiceContextType {
    swarmSyncService: ISwarmSyncService;
    omniRealtimeService: IOmniRealtimeService;
    integrityModule: IntegrityModule;
    loggerService: ILoggerService;
}

const ServiceContext = createContext<ServiceContextType | null>(null);

export const ServiceProvider: React.FC<{
    children: React.ReactNode;
    services?: Partial<ServiceContextType>;
}> = ({ children, services: overrideServices }) => {

    const services = useMemo<ServiceContextType>(() => {
        // Check for Supabase availability
        const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        return {
            swarmSyncService: overrideServices?.swarmSyncService || new WebSocketSwarmSyncService(),
            omniRealtimeService: overrideServices?.omniRealtimeService || new SupabaseOmniRealtimeService(),
            integrityModule: overrideServices?.integrityModule || 
                new IntegrityModule(hasSupabase ? new SupabaseIntegrityRepository() : new MemoryIntegrityRepository() as any),
            loggerService: overrideServices?.loggerService || new OmniLoggerService(),
        };
    }, [overrideServices]);

    return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>;
};

export function useServices(): ServiceContextType {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useServices 必須在 ServiceProvider 內部使用');
    }
    return context;
}