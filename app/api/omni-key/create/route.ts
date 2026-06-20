import { createOmniKey } from '@/lib/omni-key';

export async function POST(req: Request) {
  return createOmniKey(req);
}
