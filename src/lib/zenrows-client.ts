import crypto from 'crypto';

const API_KEY = process.env.ZENROWS_API_KEY;
const BASE = 'https://api.zenrows.com/v1';

if (!API_KEY) {
  console.warn('ZENROWS_API_KEY is not set; zenrows client will fail until configured.');
}

export type ZenrowsFetchOptions = {
  url: string;
  output?: 'markdown' | 'html' | 'text' | 'json';
  js_render?: boolean;
  premium_proxy?: boolean;
  wait?: number;
  css?: string;
};

export async function zenrowsFetch(opts: ZenrowsFetchOptions): Promise<string> {
  const params = new URLSearchParams();
  params.set('url', opts.url);
  params.set('output', opts.output || 'markdown');
  if (opts.js_render) params.set('js_render', 'true');
  if (opts.premium_proxy) params.set('premium_proxy', 'true');
  if (opts.wait) params.set('wait', String(opts.wait));
  if (opts.css) params.set('css', opts.css);

  const res = await fetch(`${BASE}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zenrows fetch failed: ${res.status} ${text}`);
  }

  return res.text();
}

export function verifyZenrowsWebhookSignature(
  payload: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader) return false;
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  const sigBuf = Buffer.from(signatureHeader);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}
