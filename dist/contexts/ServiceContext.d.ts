import React from 'react';
import { ISwarmSyncService } from '../lib/swarm/ISwarmSyncService';
import { IOmniRealtimeService } from '../lib/realtime/IOmniRealtimeService';
import { IntegrityModule } from '../lib/integrity/IntegrityModule';
import { ILoggerService } from '../lib/logger/ILoggerService';
interface ServiceContextType {
    swarmSyncService: ISwarmSyncService;
    omniRealtimeService: IOmniRealtimeService;
    integrityModule: IntegrityModule;
    loggerService: ILoggerService;
}
export declare const ServiceProvider: React.FC<{
    children: React.ReactNode;
    services?: Partial<ServiceContextType>;
}>;
export declare function useServices(): ServiceContextType;
export {};
//# sourceMappingURL=ServiceContext.d.ts.map