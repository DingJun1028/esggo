import { POST } from './route';
import { describe, it, expect } from 'vitest';

describe('Crypto Simulator API', () => {
  const mockRequest = (body: unknown) => {
    return new Request('http://localhost/api/crypto/simulator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };

  it('should handle L1 masking', async () => {
    const req = mockRequest({ action: 'mask', data: '1000', level: 'L1' });
    const res = await POST(req);
    const json = await res.json();
    expect(json.masked).toBeDefined();
    expect(json.masked).not.toBe('1000');
  });

  it('should handle L2 masking and unmasking', async () => {
    // 1. Mask
    const reqMask = mockRequest({ action: 'mask', data: 'SecretData', level: 'L2' });
    const resMask = await POST(reqMask);
    const jsonMask = await resMask.json();
    
    expect(jsonMask.masked).toBeDefined();
    expect(jsonMask.l2KeyHex).toBeDefined();

    // 2. Unmask
    const reqUnmask = mockRequest({ action: 'unmask', masked: jsonMask.masked, l2KeyHex: jsonMask.l2KeyHex });
    const resUnmask = await POST(reqUnmask);
    const jsonUnmask = await resUnmask.json();

    expect(jsonUnmask.unmasked).toBe('SecretData');
  });

  it('should return error for invalid L2 key', async () => {
    const reqUnmask = mockRequest({ action: 'unmask', masked: 'some-random-data', l2KeyHex: 'invalid-hex' });
    const resUnmask = await POST(reqUnmask);
    expect(resUnmask.status).toBe(400);
    const jsonUnmask = await resUnmask.json();
    expect(jsonUnmask.error).toBeDefined();
  });

  it('should handle L3 masking', async () => {
    const req = mockRequest({ action: 'mask', data: 'SecretData', level: 'L3' });
    const res = await POST(req);
    const json = await res.json();
    expect(json.masked).toBeDefined();
    expect(json.l2KeyHex).toBeUndefined(); // L3 is irreversible
  });

  it('should compute and verify Pedersen commitments', async () => {
    const req = mockRequest({ action: 'pedersen', values: [100, 200, 300] });
    const res = await POST(req);
    const json = await res.json();
    
    expect(json.commitments).toHaveLength(3);
    expect(json.expectedTotal).toBeDefined();
    expect(json.isValid).toBe(true);
  });
});
