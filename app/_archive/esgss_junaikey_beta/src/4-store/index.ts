/**
 * 💡 4-Store Layer: State Management (狀態管理層)
 * --------------------------------------------------
 * 統一匯出所有 Zustand stores 和狀態管理
 * [版本] Sentient v7.0.0
 */

// ========== Core App Store ==========
export { useAppStore } from '../store/useAppStore';

// ========== Domain Stores ==========
export { useESGStore } from '../store/useESGStore';
export { useStrategyStore } from '../store/useStrategyStore';
export { useImpactProject } from '../store/useImpactProject';

// ========== Task & Note Systems ==========
export { useTaskSystem } from '../store/useTaskSystem';
export { useNoteSystem } from '../store/useNoteSystem';

// ========== Omni Systems ==========
export { useOmniAvatar } from '../store/useOmniAvatar';
export { useOmniHistory } from '../store/useOmniHistory';
export { useOmniLegion } from '../store/useOmniLegion';

// ========== Infrastructure ==========
export { useOmniResonance } from '../5-store/useOmniResonance';
