import { useState, useCallback, useMemo } from 'react';
import { JunAiKeyEngine } from '../omni/core/SovereignEngine';

const engine = new JunAiKeyEngine();

export const useSovereignSession = () => {
  const [entropy, setEntropy] = useState(() => {
    const saved = localStorage.getItem('omni_system_entropy');
    return saved ? parseFloat(saved) : 0.05; // Base entropy
  });

  const [isResonant, setIsResonant] = useState(false);

  const updateEntropy = useCallback((delta: number) => {
    setEntropy(prev => {
      const next = Math.max(0, Math.min(1.0, prev + delta));
      localStorage.setItem('omni_system_entropy', next.toString());
      return next;
    });
  }, []);

  const generateBioID = useCallback((agent: any) => {
    return engine.generateBioID(agent);
  }, []);

  const toggleResonance = useCallback((csoKey: any, ctoKey: any) => {
    const success = engine.activateTwinResonance(csoKey, ctoKey);
    setIsResonant(success);
    return success;
  }, []);

  const stabilityRating = useMemo(() => {
    if (entropy < 0.2) return 'STABLE';
    if (entropy < 0.5) return 'FLUCTUATING';
    if (entropy < 0.8) return 'UNSTABLE';
    return 'CRITICAL_ENTROPY';
  }, [entropy]);

  return {
    entropy,
    stabilityRating,
    isResonant,
    updateEntropy,
    generateBioID,
    toggleResonance,
  };
};
