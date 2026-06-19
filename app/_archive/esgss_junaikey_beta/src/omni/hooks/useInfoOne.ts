import { useState, useEffect, useRef } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';

import { InfoOneCore } from '../core/InfoOneCore.ts';
import { SyncVFXService } from '../core/SyncVFXService.ts';
import { IOmniCrystal, InfoOneLifecycleStatus, IMeritProfile10 } from '../../types/esgss_schema.ts';
import { sovereignVaultService } from '../../services/SovereignVaultService.ts';

export function useInfoOne(initialName: string = 'Tiffany-Agent-01') {
    const [status, setStatus] = useState<InfoOneLifecycleStatus>('DORMANT');
    const [crystal, setCrystal] = useState<IOmniCrystal | undefined>(undefined);
    const [arvoStatus, setArvoStatus] = useState<string>('IDLE');
    const [visuals, setVisuals] = useState<any>({});
    const [isProcessing, setIsProcessing] = useState(false);

    const coreRef = useRef<InfoOneCore | null>(null);
    const vfxRef = useRef<SyncVFXService>(new SyncVFXService());

    useEffect(() => {
        // Initialize Core with a robust default profile
        const virtues: IMeritProfile10 = {
            intelligence: 8, benevolence: 8, integrity: 9, courage: 7, temperance: 8, harmony: 9
        };

        const core = new InfoOneCore({
            uuid: 'TIFFANY-OMNI-LIVE',
            name: initialName,
            virtues,
            evidence: {
                tangible: {
                    metric: 'UI_Interaction',
                    value: 100,
                    proof_url: 'local://tiffany-showcase'
                }
            },
            formula: 'Trust = Transparency * Consistency',
            impactMetric: 'Omni'
        } as any);

        // Try to hydrate from Sovereign Vault
        const persistedState = sovereignVaultService.loadFromStorage(initialName);
        if (persistedState) {
            core.hydrate(persistedState);
            omniLogger.info(LogCategory.SYSTEM, '[useInfoOne] Hydrated State for', initialName);
        } else {
            // Force active for demo purposes if fresh
            (core as any).status = 'ACTIVE';
            (core as any).activationMatrix.status = 'ACTIVE';
        }

        coreRef.current = core;
        refreshState();
    }, [initialName]);

    const refreshState = () => {
        if (!coreRef.current) return;
        const core = coreRef.current;
        const vfx = vfxRef.current;

        // Safely access properties that might be protected in strict TS but accessible at runtime
        // or assume the user has exposed them.
        setStatus((core as any).activationMatrix?.status || 'Active');
        setCrystal((core as any).omniCrystal);
        setArvoStatus((core as any).arvoStatus || 'IDLE');

        // Derive visuals using the service
        setVisuals(vfx.deriveVisuals(core));
    };

    const triggerOptimization = async () => {
        if (!coreRef.current) return;
        setIsProcessing(true);
        try {
            omniLogger.info(LogCategory.SYSTEM, '[useInfoOne] Triggering Optimization Cycle', '');
            await coreRef.current.optimize();

            // Manually trigger evidence vault to ensure crystal generation in this demo flow
            // (In full production, this might be automated by the core's state machine)
            if ((coreRef.current as any).secureEvidenceVault) {
                await (coreRef.current as any).secureEvidenceVault();
            }

            // [Phase 79] Persist State
            const stateJson = coreRef.current.dehydrate();
            sovereignVaultService.saveToStorage(initialName, stateJson);
            omniLogger.info(LogCategory.SYSTEM, '[useInfoOne] State Persisted to SovereignVault', '');

        } catch (e) {
            omniLogger.error(LogCategory.SYSTEM, '[useInfoOne] [useInfoOne] Optimization failed:', { error: e });
        }
        refreshState();
        setIsProcessing(false);
    };

    return {
        status,
        crystal,
        arvoStatus,
        visuals,
        isProcessing,
        triggerOptimization
    };
}
