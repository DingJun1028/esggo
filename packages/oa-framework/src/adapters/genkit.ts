/**
 * Genkit Adapter — Google Genkit (Firebase)
 * npm: genkit + @genkit-ai/google-genai | ai.generate()
 * 真實連結: 動態 import genkit, initialize googleAI(), generate()
 * 未安裝/無 API key 時 graceful 降級為 scaffold
 */
import type { ISubFrameAdapter, OAFrameConfig, OATask, SubFrameId } from '../core/types.js';

export class GenkitAdapter implements ISubFrameAdapter {
  readonly id: SubFrameId = 'genkit';
  readonly label = 'Google Genkit';
  readonly runtime = 'ts' as const;
  private model: string;
  private apiKey?: string;

  constructor(config: OAFrameConfig) {
    this.model = config.llmModel ?? 'gemini-2.5-flash';
    this.apiKey = config.llmApiKey;
  }

  async bootstrap(): Promise<{ ok: boolean; endpoint?: string; error?: string }> {
    try {
      // @ts-expect-error optional peer dep — 未安裝時 graceful 降級
      await import('genkit');
      // @ts-expect-error optional peer dep
      await import('@genkit-ai/google-genai');
      return { ok: true };
    } catch {
      return { ok: false, error: 'genkit 未安裝 (npm i genkit @genkit-ai/google-genai) — scaffold 模式' };
    }
  }

  async dispatch(task: OATask): Promise<{ output: string }> {
    try {
      // @ts-expect-error optional peer dep
      const { genkit } = (await import('genkit')) as any;
      // @ts-expect-error optional peer dep
      const { googleAI } = (await import('@genkit-ai/google-genai')) as any;
      const ai = genkit({ plugins: [googleAI()] });
      const { text } = await ai.generate({
        model: googleAI.model(this.model),
        prompt: task.prompt,
      });
      return { output: `[Genkit] ${text ?? ''}` };
    } catch (e: any) {
      return { output: `[Genkit] ${task.prompt} (scaffold: ${e?.message ?? 'sdk error'})` };
    }
  }

  async health() {
    try {
      // @ts-expect-error optional peer dep
      await import('genkit');
      return { status: 'ok' as const, detail: `model=${this.model}` };
    } catch {
      return { status: 'down' as const, detail: 'scaffold (npm i genkit)' };
    }
  }
}
