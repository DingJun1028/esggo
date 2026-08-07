/**
 * Genkit Adapter — Google Genkit (Firebase)
 * npm: genkit + @genkit-ai/google-genai | ai.generate()
 */
import type { ISubFrameAdapter, OAFrameConfig, OATask, SubFrameId } from '../core/types.js';

export class GenkitAdapter implements ISubFrameAdapter {
  readonly id: SubFrameId = 'genkit';
  readonly label = 'Google Genkit';
  readonly runtime = 'ts' as const;
  constructor(private config: OAFrameConfig) {}

  async bootstrap(): Promise<{ ok: boolean; endpoint?: string; error?: string }> {
    return { ok: true };
  }
  async dispatch(task: OATask): Promise<{ output: string }> {
    // 整合點: import { genkit } from 'genkit'; const ai = genkit({plugins:[googleAI()]})
    return { output: `[Genkit] ${task.prompt}` };
  }
  async health() {
    return { status: 'ok' as const, detail: 'scaffold' };
  }
}
