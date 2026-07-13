// ============================================================
// SSE thought stream route — end-to-end integration test
// tests/sse-thought-stream.test.ts
// 直接呼叫真實 route handler (GET)，透過 Node 原生 Request/Response/
// ReadableStream 驗證：訂閱思考流頻道 → 發布思考 → SSE 即時轉推，
// 並驗證 runId 過濾。使用 AbortController 模擬客戶端斷線以正確清理訂閱。
// ============================================================
import { describe, it, expect } from 'vitest';
import { GET } from '../app/api/agent/[id]/thought/stream/route';
import { publishThought } from '@/lib/bus';

async function openStream(
  runId: string,
): Promise<{
  reader: ReadableStreamDefaultReader<Uint8Array>;
  ac: AbortController;
  decoder: TextDecoder;
}> {
  const ac = new AbortController();
  const req = new Request(`http://localhost/api/agent/gemma4-local/thought/stream?runId=${runId}`, {
    signal: ac.signal,
  });
  const res = await GET(req);
  expect(res.status).toBe(200);
  expect(res.headers.get('Content-Type')).toContain('text/event-stream');
  const reader = res.body!.getReader();
  return { reader, ac, decoder: new TextDecoder() };
}

describe('SSE thought stream (GET /api/agent/[id]/thought/stream)', () => {
  it('subscribes to the agent thought topic and streams published thoughts', async () => {
    const runId = `sse-${Date.now().toString(36)}`;
    const { reader, ac, decoder } = await openStream(runId);
    let buf = '';

    setTimeout(() => {
      publishThought({ agentId: 'gemma4-local', runId, step: 1, content: 'first thought' });
      publishThought({ agentId: 'gemma4-local', runId, step: 2, content: 'second thought' });
    }, 30);

    const deadline = Date.now() + 2000;
    let foundFirst = false;
    let foundSecond = false;
    while (Date.now() < deadline) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      if (buf.includes('first thought')) foundFirst = true;
      if (buf.includes('second thought')) foundSecond = true;
      if (foundFirst && foundSecond) break;
    }
    ac.abort();
    await reader.cancel();
    expect(foundFirst).toBe(true);
    expect(foundSecond).toBe(true);
    expect(buf).toContain('"type":"thought"');
  });

  it('filters thoughts by runId', async () => {
    const runId = `sse-pass-${Date.now().toString(36)}`;
    const otherRun = `sse-skip-${Date.now().toString(36)}`;
    const { reader, ac, decoder } = await openStream(runId);
    let buf = '';

    setTimeout(() => {
      publishThought({
        agentId: 'gemma4-local',
        runId: otherRun,
        step: 1,
        content: 'should-be-filtered',
      });
      publishThought({ agentId: 'gemma4-local', runId, step: 1, content: 'should-pass' });
    }, 30);

    const deadline = Date.now() + 2000;
    let foundPass = false;
    while (Date.now() < deadline) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      if (buf.includes('should-pass')) foundPass = true;
      if (foundPass) break;
    }
    ac.abort();
    await reader.cancel();
    expect(foundPass).toBe(true);
    expect(buf).not.toContain('should-be-filtered');
  });
});
