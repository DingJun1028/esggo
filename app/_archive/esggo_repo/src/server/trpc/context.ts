import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { UserID } from '../../shared/types/evidence.types';

export interface Context {
  user: { id: UserID } | null;
  requestId: string;
}

export async function createContext({
  req,
}: FetchCreateContextFnOptions): Promise<Context> {
  // 這裡未來可以擴充：從 Header 解析 JWT 或 Session
  return {
    user: null, // 暫時預設
    requestId: req.headers.get('x-request-id') || Math.random().toString(36),
  };
}
