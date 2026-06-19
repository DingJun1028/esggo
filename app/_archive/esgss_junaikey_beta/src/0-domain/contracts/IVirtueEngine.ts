import { IMeritProfile10 } from './IComponentCore';

/** 🎮 遊戲戰鬥屬性 (Game Battle Attributes) */
export interface PartnerAttributes {
  hp: number;
  mp: number;
  atk: number;
  def: number;
  speed: number;
  luck: number;
  focus: number; // 專注度
}

/** 🔄 德行對應轉換邏輯 (Attribute Converter) */
export interface IAttributeConverter {
  /**
   * 轉換德行至戰鬥屬性
   * @param virtues 德行指標 (1-10)
   */
  convert(virtues: IMeritProfile10): PartnerAttributes;
}

/** 🏛️ 德行引擎介面 */
export interface IVirtueEngine {
  calculateAttributes(virtues: IMeritProfile10): PartnerAttributes;
}
