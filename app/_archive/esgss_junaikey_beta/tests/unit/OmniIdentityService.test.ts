import { describe, it, expect, beforeEach, vi } from 'vitest';
import { omniIdentityService } from '@/services/OmniIdentityService.js';
import { OmniStore, OmniNamespace } from '@/services/OmniStore.js';

// Mock Web Crypto API
const mockCrypto = {
  subtle: {
    generateKey: vi.fn().mockResolvedValue({}),
    sign: vi.fn().mockResolvedValue(new ArrayBuffer(64)),
    verify: vi.fn().mockResolvedValue(true),
    digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
  },
  getRandomValues: vi.fn(arr => arr),
};

Object.defineProperty(globalThis, 'crypto', {
  value: mockCrypto,
});

describe('OmniIdentityService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (omniIdentityService as any).currentIdentity = null;
    vi.spyOn(OmniStore, 'getItem').mockReturnValue({ success: false });
    vi.spyOn(OmniStore, 'setItem').mockImplementation(() => ({ success: true }));
  });

  it('應能生成初始主權身份 (Genesis Identity)', async () => {
    const identity = await omniIdentityService.getMyIdentity();

    expect(identity).toBeDefined();
    expect(identity.did).toContain('did:omni:sov-');
    expect(identity.type).toBe('SYSTEM');
    expect(identity.level).toBe(9);
  });

  it('應能正確對內容進行簽章與驗證', async () => {
    const payload = { data: 'NIRVANA_PHASE_29', value: 100 };
    const sig = await omniIdentityService.signPayload(payload);

    expect(sig.signer_did).toBeDefined();
    expect(sig.payload_hash).toBeDefined();

    const isValid = await omniIdentityService.verifySignature(payload, sig);
    expect(isValid).toBe(true);
  });

  it('若內容被篡改，驗證應失敗', async () => {
    const payload = { data: 'ORIGINAL' };
    const sig = await omniIdentityService.signPayload(payload);

    const tamperedPayload = { data: 'TAMPERED' };
    const isValid = await omniIdentityService.verifySignature(tamperedPayload, sig);

    expect(isValid).toBe(false);
  });
});
