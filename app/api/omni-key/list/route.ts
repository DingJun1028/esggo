import { listOmniKeys } from '@/lib/omni-key';

export async function GET(req: Request) {
  return listOmniKeys(req);
}
