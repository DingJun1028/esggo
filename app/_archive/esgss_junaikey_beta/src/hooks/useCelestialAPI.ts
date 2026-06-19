// src/hooks/useCelestialAPI.ts
// Hook for interacting with Celestial Server API

import { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:3001/api';

export interface AgentConfig {
  name: string;
  systemPrompt: string;
  tone?: string;
  language?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  type: 'text' | 'thought';
  content: string;
  timestamp: number;
}

export function useCelestialAPI() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 顯現 Agent（建立 Session）
  const manifestAgent = useCallback(async (config: AgentConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/manifest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_agent: {
            metadata: { name: config.name },
            directives: { system_prompt: config.systemPrompt },
          },
          overrides: {
            mask: {
              tone: config.tone || 'Professional',
              language: config.language || 'zh-TW',
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to manifest agent: ${response.statusText}`);
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      return data.sessionId;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 發送訊息並接收 SSE 串流
  const sendMessage = useCallback(
    async (message: string, onChunk: (chunk: ChatMessage) => void) => {
      if (!sessionId) {
        throw new Error('No active session. Please manifest an agent first.');
      }

      setIsLoading(true);
      setError(null);

      try {
        const url = `${API_BASE}/interact?sessionId=${sessionId}&message=${encodeURIComponent(message)}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                onChunk({
                  id: `${Date.now()}-${Math.random()}`,
                  role: 'assistant',
                  type: data.type === 'thought' ? 'thought' : 'text',
                  content: data.content,
                  timestamp: Date.now(),
                });
              } catch (e) {
                console.warn('Failed to parse SSE data:', line);
              }
            }
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId]
  );

  return {
    sessionId,
    isLoading,
    error,
    manifestAgent,
    sendMessage,
  };
}
