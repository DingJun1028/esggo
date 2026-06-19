/**
 * @esgss/jun-ai-ceremony
 * 量子動畫組件索引
 * 
 * 液態玻璃 UI 與量子動畫組件集合
 * 
 * 包含：
 * - QuantumFlash - 量子閃頻動畫
 * - QuantumEntanglement - 量子糾纏動畫
 * - HealingField - 自癒場域視覺化
 * - AllianceMedal - 四大支柱勛章卡
 * - AllianceMerge - 四卡匯聚動畫
 */

// ============== Quantum Animations ==============

export { QuantumFlash, QuantumFlashProvider, createQuantumFlash } from './QuantumFlash';
export type { QuantumFlashProps, QuantumFlashConfig } from './QuantumFlash';

export { QuantumEntanglement, CardDrawEntanglement, createQuantumEntanglement } from './QuantumEntanglement';
export type { QuantumEntanglementProps, QuantumEntanglementConfig } from './QuantumEntanglement';

export { HealingField, HealingDataDisplay, createHealingField } from './HealingField';
export type { HealingFieldProps, HealingFieldConfig } from './HealingField';

// ============== Alliance Components ==============

export { 
  AllianceMedal, 
  AllianceMedalSet, 
  createAllianceMedal,
  PILLAR_CONFIGS 
} from './AllianceMedal';
export type { 
  AllianceMedalProps, 
  AllianceMedalConfig, 
  PillarType,
  PillarConfig 
} from './AllianceMedal';

export { 
  AllianceMerge, 
  ScriptureCreationFlow, 
  createAllianceMerge 
} from './AllianceMerge';
export type { 
  AllianceMergeProps, 
  AllianceMergeConfig 
} from './AllianceMerge';

// ============== Version Info ==============

export const QUANTUM_VERSION = '1.0.0';
export const QUANTUM_NAME = '@esgss/jun-ai-ceremony/quantum';
export const QUANTUM_DESCRIPTION = '液態玻璃 UI 與量子動畫組件集合';
