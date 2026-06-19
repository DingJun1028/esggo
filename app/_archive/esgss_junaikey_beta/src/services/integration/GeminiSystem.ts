import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

/**
 * Gemini System Adapter (Frontend)
 * --------------------------------------------------
 * Centralized client-side adapter for the backend Gemini Intelligence API.
 * Replaces legacy direct API calls with secure server-side delegation.
 */
export interface IGeminiInteraction {
  sessionId: string;
  message: string;
  onToken?: (token: string) => void;
  onThought?: (thought: string) => void;
  onSkill?: (skill: any) => void;
  onError?: (error: string) => void;
}

export interface IGeminiManifestation {
  source_agent: string | object;
  overrides?: {
    mask?: {
      tone?: string;
      language?: string;
    };
  };
}

export class GeminiSystem {
  private static readonly BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  /**
   * Manifest a new Agent Session
   */
  static async manifest(
    config: IGeminiManifestation
  ): Promise<{ sessionId: string; agentName: string }> {
    try {
      const response = await fetch(`${this.BASE_URL}/manifest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error(`Manifestation failed: ${response.statusText}`);

      return await response.json();
    } catch (error) {
      omniLogger.error(LogCategory.AI, 'Failed to manifest agent', { error });
      throw error;
    }
  }

  /**
   * Interact with an Agent Session (SSE Streaming)
   */
  static async interact(options: IGeminiInteraction): Promise<void> {
    const { sessionId, message, onToken, onThought, onSkill, onError } = options;

    try {
      omniLogger.info(LogCategory.AI, 'Initiating interaction', { sessionId });

      const eventSource = new EventSource(
        `${this.BASE_URL}/interact?sessionId=${sessionId}&message=${encodeURIComponent(message)}`
      );

      eventSource.onmessage = event => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'text':
              onToken?.(data.content);
              break;
            case 'thought':
              onThought?.(data.content);
              break;
            case 'skill_call':
              onSkill?.(data.content);
              break;
            case 'error':
              onError?.(data.content);
              eventSource.close();
              break;
          }
        } catch (e) {
          // Ignore ping/keepalive or parse errors
        }
      };

      eventSource.onerror = err => {
        omniLogger.error(LogCategory.SYSTEM, '[GeminiSystem] SSE Error:', { error: err });
        onError?.('Connection interrupted');
        eventSource.close();
      };
    } catch (error) {
      omniLogger.error(LogCategory.AI, 'Interaction failed', { error });
      onError?.(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Trigger Swarm Intelligence
   */
  static async runSwarm(goal: string): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/swarm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });

      if (!response.ok) throw new Error('Swarm failed');
      return await response.json();
    } catch (error) {
      omniLogger.error(LogCategory.AI, 'Swarm execution failed', { error });
      throw error;
    }
  }
}
