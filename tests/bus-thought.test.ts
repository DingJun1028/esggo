// ============================================================
// OmniAgentBus — thinking channel (publishThought / subscribeBusEvent)
// tests/bus-thought.test.ts
// ============================================================
import { describe, it, expect } from 'vitest';
import { publishThought, subscribeBusEvent, publishBusEvent } from '@/lib/bus';

describe('OmniAgentBus thinking channel', () => {
  it('publishThought emits on the agent thought topic and delivers via subscribeBusEvent', () => {
    const received: unknown[] = [];
    const unsub = subscribeBusEvent('omni://agent/gemma4-local/thought', (ev: any) => {
      received.push(ev);
    });
    publishThought({ agentId: 'gemma4-local', runId: 'run-1', step: 1, content: 'thinking hard' });
    unsub();
    expect(received.length).toBe(1);
    const ev = received[0] as any;
    expect(ev.payload.runId).toBe('run-1');
    expect(ev.payload.step).toBe(1);
    expect(ev.payload.content).toBe('thinking hard');
    // publishBusEvent 應附加 hashLock 溯源
    expect(typeof ev.hashLock).toBe('string');
    expect(ev.hashLock.length).toBe(64);
  });

  it('subscribeBusEvent filters by topic', () => {
    const a: unknown[] = [];
    const b: unknown[] = [];
    const unsubA = subscribeBusEvent('omni://agent/agentA/thought', (ev: any) => a.push(ev));
    subscribeBusEvent('omni://agent/agentB/thought', (ev: any) => b.push(ev));
    publishThought({ agentId: 'agentA', runId: 'r', step: 1, content: 'to A' });
    unsubA();
    expect(a.length).toBe(1);
    expect(b.length).toBe(0);
  });

  it('publishBusEvent attaches a hashLock', () => {
    const { hashLock } = publishBusEvent('omni://test/x', {
      event: 'test',
      payload: { hello: 'world' },
      ts: 1,
    } as any);
    expect(hashLock).toMatch(/^[a-f0-9]{64}$/);
  });
});
