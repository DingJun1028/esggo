import { IOmniRouter, IOmniAtom } from './omni-types';

/**
 * 🌐 OmniRouter: 萬能智慧路由
 * 職責：數據流向的動態調度與檢哨
 */
export class OmniRouter implements IOmniRouter {

    /**
     * 🛣️ route: 決定數據的主存儲路徑
     */
    public async route(atom: IOmniAtom<any>): Promise<string> {
        const type = atom.heritage?.version ? 'evolution' : 'genesis';
        const domain = atom.domainRef.toLowerCase();

        if (domain.includes('report')) return `/vault/reports/${type}`;
        if (domain.includes('carbon')) return `/vault/carbon/${type}`;
        if (domain.includes('intel')) return `/vault/intelligence/${type}`;

        return `/vault/general/${type}`;
    }

    /**
     * 🛡️ guard: 執行路由前的安全與完整性檢哨
     */
    public guard(atom: IOmniAtom<any>): boolean {
        // 1. 5T 協議基礎檢查
        if (!atom.uuid || !atom.originHash || !atom.signature) return false;

        // 2. 核心鎖定檢查 (若為 Trustworthy 狀態則必須 Frozen)
        if (atom.status === 'Trustworthy' && !atom.isFrozen) return false;

        return true;
    }
}

export const omniRouter = new OmniRouter();
