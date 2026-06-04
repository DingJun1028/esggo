/**
 * 萬能元件心核庫 (Atomic Core System)
 * 負責底層元件型別定義、狀態註冊與全域主題治理
 */
export type UniversalThemeId = 'benevolent-classic' | 'berkeley-academy' | 'extreme-minimalist' | 'best-practice';
export type ModeLayer = 'light' | 'dark' | 'system';
export type TrustStatus = 'Trustworthy' | 'Experimental' | 'Deprecated' | 'Auditing';
export type AtomicLevel = 'atom' | 'molecule' | 'organism' | 'template' | 'page';
export interface IAtomicComponent {
    atomId: string;
    type: AtomicLevel;
    version: string;
    core: {
        status: TrustStatus;
    };
    reference: {
        specification: string;
        intent: string;
        governanceNode: string;
    };
}
declare class AtomicManager {
    private registry;
    /**
     * 註冊原子元件至心核資料庫
     * @param atom 實作 IAtomicComponent 的元件詮釋資料
     */
    registerAtom(atom: IAtomicComponent): void;
    /**
     * 全域切換主題與渲染模式
     * @param theme 預設主題
     * @param mode 顯示模式
     */
    switchTheme(theme: UniversalThemeId, mode: ModeLayer): void;
    /**
     * 取得特定 ID 的元件詮釋資料
     */
    getAtom(atomId: string): IAtomicComponent | undefined;
    /**
     * 取得目前所有已註冊的元件清單 (可用於動態沙盒展示或稽核)
     */
    getAllRegisteredAtoms(): IAtomicComponent[];
    /**
     * (NEW) 執行 5T 協議：將本地元件清單單向寫入 Supabase 雲端登錄表
     */
    syncToCloud(): Promise<void>;
}
export declare const atomicManager: AtomicManager;
export {};
//# sourceMappingURL=atomic-core.d.ts.map