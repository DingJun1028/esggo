'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from 'react';
import { WebSocketSwarmSyncService } from '../lib/swarm/WebSocketSwarmSyncService';
import { SupabaseOmniRealtimeService } from '../lib/realtime/SupabaseOmniRealtimeService';
import { IntegrityModule } from '../lib/integrity/IntegrityModule';
import { SupabaseIntegrityRepository } from '../lib/integrity/SupabaseIntegrityRepository';
import { OmniLoggerService } from '../lib/logger/OmniLoggerService';
// Fallback memory store for offline mode
const memoryIntegrityStore = new Map();
class MemoryIntegrityRepository {
    async saveRecord(record) {
        memoryIntegrityStore.set(record.id, record);
    }
    async getRecord(id) {
        return memoryIntegrityStore.get(id) ?? null;
    }
    async verifyHash(id, currentHash) {
        const record = await this.getRecord(id);
        return record?.hash === currentHash;
    }
}
const ServiceContext = createContext(null);
export const ServiceProvider = ({ children, services: overrideServices }) => {
    const services = useMemo(() => {
        // Check for Supabase availability
        const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
        return {
            swarmSyncService: overrideServices?.swarmSyncService || new WebSocketSwarmSyncService(),
            omniRealtimeService: overrideServices?.omniRealtimeService || new SupabaseOmniRealtimeService(),
            integrityModule: overrideServices?.integrityModule ||
                new IntegrityModule(hasSupabase ? new SupabaseIntegrityRepository() : new MemoryIntegrityRepository()),
            loggerService: overrideServices?.loggerService || new OmniLoggerService(),
        };
    }, [overrideServices]);
    return _jsx(ServiceContext.Provider, { value: services, children: children });
};
export function useServices() {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useServices 必須在 ServiceProvider 內部使用');
    }
    return context;
}
//# sourceMappingURL=ServiceContext.js.map