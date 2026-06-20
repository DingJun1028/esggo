import { revokeOmniKey } from '@/lib/omni-key';

export async function POST(req: Request) {
  return revokeOmniKey(req);
}
