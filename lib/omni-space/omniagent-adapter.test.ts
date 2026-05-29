import { describe, it, expect, vi } from 'vitest';
import { omniagentAdapter } from './omniagent-adapter';
import { adapterRegistry } from './adapter-registry';

describe('OmniSpace OmniAgent Paperclip Adapter', () => {
  it('should detect the correct model and provider', async () => {
    const config = await omniagentAdapter.detectModel();
    expect(config.model).toContain('omniagent');
    expect(config.provider).toBe('OpenRouter');
  });

  it('should execute a task and return a structured transcript', async () => {
    const transcript = await omniagentAdapter.execute('test_session', 'Verify ESG Data');
    expect(transcript).toHaveLength(3);
    expect(transcript[0].type).toBe('thought');
    expect(transcript[1].toolName).toBe('omni_vault_scan');
    expect(transcript[2].type).toBe('response');
  });

  it('should correctly process raw output into clean markdown', () => {
    const raw = '+----------+\n|  TABLE   |\n+----------+\n======= HEADING =======';
    const processed = omniagentAdapter.processOutput(raw);
    expect(processed).not.toContain('+--');
    expect(processed).toContain('--- HEADING ---');
  });

  it('should be registered in the adapter registry', () => {
    const manifest = adapterRegistry.getAdapter('omniagent_local');
    expect(manifest).toBeDefined();
    expect(manifest?.name).toContain('OmniAgent Paperclip Adapter');
  });
});
