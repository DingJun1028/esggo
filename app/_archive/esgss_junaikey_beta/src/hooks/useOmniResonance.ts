import { useState, useEffect } from 'react';
import { omniMindService, SystemEquilibrium } from '../services/OmniMindService';

export interface ResonanceAura {
  deepPenetration: boolean;
  broadConnectivity: boolean;
  equilibrium: SystemEquilibrium | null;
  resonanceLevel: number;
}

/**
 * 奧秘共鳴 Hook (Omni Resonance Hook)
 * 讓每個組件都能「深貫廣通」地感知系統心智狀態。
 */
export const useOmniResonance = () => {
  const [aura, setAura] = useState<ResonanceAura>({
    deepPenetration: false,
    broadConnectivity: false,
    equilibrium: null,
    resonanceLevel: 0,
  });

  useEffect(() => {
    const syncResonance = () => {
      const guard = omniMindService.ensureOmniResonance();
      const status = omniMindService.getEquilibriumStatus();

      setAura({
        deepPenetration: guard.deepPenetration,
        broadConnectivity: guard.broadConnectivity,
        equilibrium: status,
        resonanceLevel: status ? status.globalResonanceParity * 100 : 0,
      });
    };

    syncResonance();
  }, []);

  return aura;
};
