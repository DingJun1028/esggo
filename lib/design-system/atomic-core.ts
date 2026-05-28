/**
 * 🌌 Universal Atomic Component Library - Core (萬能元件原子庫 - 核心)
 * v1.0 | #AtomicArchitecture #ReferencePrinciple #T3Tangible
 * 
 * 遵循「參照原則」：每一組件皆需參照設計聖典與誠信協議。
 */

import { IComponentCore } from '../../shared/types';

/** 原子組件類型 */
export type AtomicType = 'atom' | 'molecule' | 'organism' | 'template';

/** 主題識別碼 */
export type UniversalThemeId = 
  | 'benevolent-classic' // 善向永續經典款
  | 'berkeley-academy'   // 柏克萊學院風
  | 'extreme-minimalist' // 極致簡約款
  | 'best-practice';     // 最佳實踐款

/** 模式分層 */
export type ModeLayer = 'light' | 'dark' | 'system';

/**
 * @interface IAtomicComponent
 * @description 萬能原子組件基本契約
 */
export interface IAtomicComponent {
  readonly atomId: string;       // 原子唯一識別碼 (如: ATOM_BTN_001)
  readonly type: AtomicType;     // 層級
  readonly version: string;      // 版本
  readonly core: IComponentCore; // 連結至萬能心核 (T3/T4 誠信保障)
  
  // 參照原則 (Reference Principle)
  readonly reference: {
    specification: string;       // 參照規範 (如: "ISO-14064 UI Spec")
    intent: string;              // 設計意圖
    governanceNode: string;      // 關聯之治理節點
  };
}

/**
 * @interface IAtomicLibrary
 * @description 原子庫管理介面
 */
export interface IAtomicLibrary {
  name: string;
  theme: UniversalThemeId;
  mode: ModeLayer;
  atoms: Map<string, IAtomicComponent>;
}

/**
 * 原子庫管理員 (Atomic Library Manager)
 * 負責組件的 建立、使用 與 管理。
 */
export class AtomicLibraryManager {
  private library: IAtomicLibrary;

  constructor(theme: UniversalThemeId = 'best-practice', mode: ModeLayer = 'system') {
    this.library = {
      name: 'Omni Universal Atomic Library',
      theme,
      mode,
      atoms: new Map()
    };
  }

  /** 建立原子組件 (Establish) */
  public registerAtom(atom: IAtomicComponent): void {
    console.log(`[AtomicLibrary] Registering atom: ${atom.atomId} (v${atom.version})`);
    this.library.atoms.set(atom.atomId, atom);
  }

  /** 使用原子組件 (Usage) */
  public getAtom(atomId: string): IAtomicComponent | undefined {
    return this.library.atoms.get(atomId);
  }

  /** 管理庫 (Management) */
  public listAtoms(): IAtomicComponent[] {
    return Array.from(this.library.atoms.values());
  }

  /** 切換主題/模式 */
  public switchTheme(theme: UniversalThemeId, mode: ModeLayer): void {
    this.library.theme = theme;
    this.library.mode = mode;
    console.log(`[AtomicLibrary] Switched to ${theme} (${mode})`);
  }
}

export const atomicManager = new AtomicLibraryManager();
