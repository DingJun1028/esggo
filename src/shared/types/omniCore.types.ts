// src/shared/types/omniCore.types.ts
/**
 * OmniCoreMatrix: a flexible key‑value map describing the component's design diagram,
 * versioning, and the full 5T+1 dimension matrix.
 */
export interface OmniCoreMatrix {
  // 任意鍵值對，描述元件的全域設計圖與版本資訊
  [key: string]: unknown;
}

/**
 * OmniCoreRecord: the persistent core record stored in Supabase.
 * 包含萬能晶體 (crystal)、萬能永憶 (eternalMemory) 以及終始矩陣。
 */
export interface OmniCoreRecord {
  id: string; // 內部唯一 ID，例如 `core-OMNI-001`
  componentId: string; // 參照 IOmniComponent.id
  version: string; // 元件版本號
  crystal: Record<string, unknown>; // 萬能晶體資料
  eternalMemory: Record<string, unknown>; // 萬能永憶
  matrix: OmniCoreMatrix; // 終始矩陣 (5T+1 維度)
}
