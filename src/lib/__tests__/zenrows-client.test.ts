import { describe, it, expect } from 'vitest';
import { verifyZenrowsWebhookSignature } from '../zenrows-client';

describe('zenrows client', () => {
  it('verifyZenrowsWebhookSignature returns false for null header', () => {
    expect(verifyZenrowsWebhookSignature('payload', null, 'secret')).toBe(false);
  });

  it('verifyZenrowsWebhookSignature returns true for matching signature', async () => {
    const secret = 'secret';
    const payload = 'payload';
    const crypto = await import('crypto');
    const expected = `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;
    expect(verifyZenrowsWebhookSignature(payload, expected, secret)).toBe(true);
  });
});
