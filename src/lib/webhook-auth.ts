import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export function verifyWebhookSignature(
  payload: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const expected = `sha256=${hmac.update(payload).digest('hex')}`;
  const sigBuf = Buffer.from(signatureHeader);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

export async function requireWebhookAuth(req: NextRequest): Promise<NextResponse | null> {
  const signature = req.headers.get('X-Signature-256');
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret || !verifyWebhookSignature(await req.clone().text(), signature, secret)) {
    return NextResponse.json({ error: 'Invalid or missing webhook signature' }, { status: 401 });
  }
  return null;
}
