/**
 * LLM 適配層 — 本機 Ollama (免費算立) + 自動降級 Mock
 * 對齊: 硬規「只用免費算立」(禁付費 API)
 */
export interface LLMResponse {
  text: string;
  model: string;
  source: 'ollama' | 'mock';
}

export async function callLLM(prompt: string, opts?: { model?: string; baseUrl?: string }): Promise<LLMResponse> {
  const model = opts?.model ?? process.env.OLLAMA_MODEL ?? 'qwen2.5:3b-instruct-q4_K_M';
  const base = opts?.baseUrl ?? process.env.OLLAMA_BASE ?? 'http://localhost:11434';

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(`${base}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!r.ok) throw new Error(`ollama ${r.status}`);
    const j = (await r.json()) as { response?: string };
    return { text: j.response ?? '', model, source: 'ollama' };
  } catch {
    // Trustworthy: 降級不隱瞞，標註 mock 來源
    return {
      text: `[MOCK] 蜂群收到任務：「${prompt.slice(0, 60)}」。Ollama 未連線，使用本地推演骨架回應。`,
      model: 'mock',
      source: 'mock',
    };
  }
}
