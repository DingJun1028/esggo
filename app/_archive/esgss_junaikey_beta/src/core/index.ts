/**
 * ESGss JunAiKey Beta - Core Module Index
 * 核心模組索引文件
 * 
 * 導出所有核心模組：
 * - Start-End Matrix 數據結構
 * - Anti-gravity 設計令牌
 */

// ============================================================================
// Start-End Matrix 數據結構
// ============================================================================

export {
  UUIDUtil,
  StartEndMatrixBuilder,
  StartEndMatrixExecutor,
  MatrixNodeType,
  MatrixNodeState,
  type UUID,
  type MatrixNode,
  type StartEndMatrix,
  type MatrixTransform,
  type MatrixValidator,
} from './data-structures/StartEndMatrix';

// ============================================================================
// Anti-gravity 設計令牌
// ============================================================================

export {
  antiGravityColors,
  antiGravityShadows,
  antiGravitySpacing,
  antiGravityBorderRadius,
  antiGravityAnimations,
  antiGravityOpacity,
  antiGravityBlur,
  antiGravityBreakpoints,
  antiGravityZIndex,
  antiGravityTypography,
} from './design-tokens/AntiGravityTokens';

// ============================================================================
// 導出默認
// ============================================================================

export { default as StartEndMatrix } from './data-structures/StartEndMatrix';
export { default as AntiGravityTokens } from './design-tokens/AntiGravityTokens';
