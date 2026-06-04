import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { UserID } from '../../shared/types/evidence.types';
export interface Context {
    user: {
        id: UserID;
    } | null;
    requestId: string;
}
export declare function createContext({ req, }: FetchCreateContextFnOptions): Promise<Context>;
//# sourceMappingURL=context.d.ts.map