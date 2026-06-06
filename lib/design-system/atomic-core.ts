/**
 * 萬能元件心核庫 (Atomic Core System)
 * 負責底層元件型別定義、狀態註冊與全域主題治理
 */

export type OmniThemeId = 'benevolent-classic' | 'berkeley-academy' | 'extreme-minimalist' | 'best-practice';
export type ModeLayer = 'light' | 'dark' | 'system';

// 5T 誠信協議狀態
export type TrustStatus = 'Trustworthy' | 'Experimental' | 'Deprecated' | 'Auditing';

// 元件架構層級 (Atomic Design Methodology)
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

class AtomicManager {
  // 使用 Map 來儲存註冊的元件，確保 atomId 的唯一性與 O(1) 尋找效率
  private registry: Map<string, IAtomicComponent> = new Map();

  /**
   * 註冊原子元件至心核資料庫
   * @param atom 實作 IAtomicComponent 的元件詮釋資料
   */
  public registerAtom(atom: IAtomicComponent): void {
    if (!this.registry.has(atom.atomId)) {
      this.registry.set(atom.atomId, atom);
      console.log(`[OmniCore] Component Registered: ${atom.atomId} - ${atom.reference.intent}`);
    }
  }

  /**
   * 全域切換主題與渲染模式
   * @param theme 預設主題
   * @param mode 顯示模式
   */
  public switchTheme(theme: OmniThemeId, mode: ModeLayer): void {
    console.log(`[OmniCore] Theme switched: ${theme} - ${mode}`);
  }

  /**
   * 取得特定 ID 的元件詮釋資料
   */
  public getAtom(atomId: string): IAtomicComponent | undefined {
    return this.registry.get(atomId);
  }

  /**
   * 取得目前所有已註冊的元件清單 (可用於動態沙盒展示或稽核)
   */
  public getAllRegisteredAtoms(): IAtomicComponent[] {
    return Array.from(this.registry.values());
  }

  /**
   * (NEW) 執行 5T 協議：將本地元件清單單向寫入 Supabase 雲端登錄表
   */
  public async syncToCloud(): Promise<void> {
    const atoms = this.getAllRegisteredAtoms();
    if (atoms.length === 0) return;

    try {
      const response = await fetch('/api/atomic/registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', atoms })
      });
      const data = await response.json();
      if (data.success) {
        console.log(`[OmniCore] Sync to Cloud complete: ${data.count} atoms synced.`);
      } else {
        console.warn(`[OmniCore] Sync to Cloud failed: ${data.error}`);
      }
    } catch (e) {
      console.error(`[OmniCore] Sync to Cloud encountered error:`, e);
    }
  }
}

// 導出 Singleton 實例供全域使用
export const atomicManager = new AtomicManager();