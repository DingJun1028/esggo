import { useState, useEffect } from 'react';
import {
  executeAgentUnityUltimate,
  checkAgentUnityUnlocked,
  AGENT_UNITY_ULTIMATE,
} from '@/omni/skills/AgentUnityUltimate';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

export const useUltimateSkill = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    truthsRevealed: number;
    evidenceLinked: number;
    insightsBroadcast: number;
  } | null>(null);

  useEffect(() => {
    // Check if skill is unlocked
    const unlocked = checkAgentUnityUnlocked();
    setIsUnlocked(unlocked);

    // Add keyboard shortcut: Alt+U
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'u') {
        e.preventDefault();
        if (unlocked && !isExecuting) {
          executeUltimate();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExecuting]); // Dependency on isExecuting to prevent double fire

  const executeUltimate = async () => {
    if (isExecuting) return;

    omniLogger.info(LogCategory.UI, '用戶觸發奧義: 代理合一', {
      source_origin: 'OmniCrystal',
    });

    setIsExecuting(true);
    setShowResult(false);

    try {
      const executionResult = await executeAgentUnityUltimate();
      setResult(executionResult);
      setShowResult(true);

      // Auto-hide result after 10 seconds
      setTimeout(() => {
        setShowResult(false);
      }, 10000);
    } catch (error) {
      omniLogger.error(LogCategory.UI, '奧義執行失敗', {
        error: String(error),
        source_origin: 'OmniCrystal',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    isUnlocked,
    isExecuting,
    showResult,
    result,
    executeUltimate,
    setShowResult, // Allow manual dismiss
    skillInfo: AGENT_UNITY_ULTIMATE,
  };
};
