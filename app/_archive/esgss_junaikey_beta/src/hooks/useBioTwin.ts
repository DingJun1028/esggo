import { useState, useCallback } from 'react';
import { TwinEngine, TwinState, StressScenario } from '../services/TwinEngine';
import { useSovereignSession } from './useSovereignSession';

export const useBioTwin = () => {
  const [twins, setTwins] = useState<TwinState[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const { updateEntropy } = useSovereignSession();

  const cloneInstance = useCallback((original: any, type: 'AGENT' | 'LEGION') => {
    const newTwin = TwinEngine.createTwin(original, type);
    setTwins(prev => [...prev, newTwin]);
    return newTwin;
  }, []);

  const executeStressTest = useCallback(async (twinId: string, scenario: StressScenario) => {
    setIsSimulating(true);
    // 模擬高壓計算延遲
    await new Promise(r => setTimeout(r, 1500));

    setTwins(prev =>
      prev.map(t => {
        if (t.id === twinId) {
          return TwinEngine.runScenario(t, scenario);
        }
        return t;
      })
    );

    setIsSimulating(false);
  }, []);

  const mergeInsights = useCallback(
    (twinId: string) => {
      const twin = twins.find(t => t.id === twinId);
      if (!twin || twin.simulatedInsights <= 0) return;

      // 將模擬心得轉化為全域熵值降低
      const stabilization = twin.simulatedInsights / 500;
      updateEntropy(-stabilization);

      // 移除克隆體 (一次性使用)
      setTwins(prev => prev.filter(t => t.id !== twinId));
    },
    [twins, updateEntropy]
  );

  return {
    twins,
    isSimulating,
    cloneInstance,
    executeStressTest,
    mergeInsights,
  };
};
