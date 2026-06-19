import { useState, useCallback, useEffect, useMemo } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { OmniAgent } from '../0-core/trinity/OmniAgent';
import { Agent, AgentStatus } from '../types/agency';
import { GeminiService } from '../services/ai/GeminiService';
import { useSovereignSystem } from '../contexts/SovereignContext';

export interface TwinMessage {
  role: 'user' | 'twin';
  content: string;
  timestamp: string;
}

export const useOmniTwin = () => {
  const { resonanceLevel, entropyLevel } = useSovereignSystem();

  // Initial Mock Agent if none exists in global state
  const [agentData, setAgentData] = useState<Agent>({
    id: 'twin_oracle_001',
    name: 'CSO STRATEGY ORACLE',
    role: 'STRATEGIST',
    agent_status: 'AWAKENED',
    description:
      'The digital soul of JunAiKey, dedicated to ESG sovereignty and sustainable alpha.',
    level: 10,
    experience: 8500,
    nextLevelExp: 10000,
    dna: {
      intelligence: 95,
      creativity: 82,
      empathy: 88,
      resilience: 76,
      precision: 91,
      speed: 84,
    },
    skills: [],
    equipment: {},
    titles: [],
    isAwakened: true,
    avatarColor: 'primary',
    createdAt: new Date(),
    avatarHistory: [],
  });

  const omniAgent = useMemo(() => new OmniAgent(agentData), [agentData]);

  const [chatHistory, setChatHistory] = useState<TwinMessage[]>([
    {
      role: 'twin',
      content: '系統校準完成。指揮官，數位分身已同步就緒。',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isThinking) return;

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userMsg: TwinMessage = { role: 'user', content, timestamp };
      setChatHistory(prev => [...prev, userMsg]);
      setIsThinking(true);

      try {
        // Use Gemini via OmniAgent.think
        const response = await omniAgent.think(content);
        const twinMsg: TwinMessage = {
          role: 'twin',
          content: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatHistory(prev => [...prev, twinMsg]);
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '[useOmniTwin] Twin Thinking Error:', { error })
        const errorMsg: TwinMessage = {
          role: 'twin',
          content: '思維路徑發生混亂 (Quantum Noise Detected)。請重新嘗試。',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatHistory(prev => [...prev, errorMsg]);
      } finally {
        setIsThinking(false);
      }
    },
    [omniAgent, isThinking]
  );

  return {
    agent: agentData,
    chatHistory,
    isThinking,
    sendMessage,
    metrics: {
      resonance: resonanceLevel,
      entropy: entropyLevel,
      efficiency: 94.2,
      alignment: 0.998,
      knowledgeAssets: 124, // Knowledge as Asset
      learningProgress: 88, // Learning-Centered
    },
  };
};
