/**
 * Components - Index
 * 組件庫 - 索引文件
 * 
 * 導出所有組件相關的模組
 */

// ============================================================================
// UI 組件
// ============================================================================

export {
  UUIDDisplay,
  UUIDCard,
  UUIDList,
} from './ui/UUIDDisplay/UUIDDisplay';

export type {
  UUIDDisplayProps,
  UUIDCardProps,
  UUIDListProps,
  UUIDDisplayMode,
} from './ui/UUIDDisplay/UUIDDisplay';

// ============================================================================
// 布局組件
// ============================================================================

export {
  AntiGravityLayout,
  AntiGravityGrid,
  AntiGravityFlex,
  AntiGravityContainer,
  AntiGravitySection,
} from './layout/AntiGravityLayout/AntiGravityLayout';

export type {
  AntiGravityLayoutProps,
  AntiGravityGridProps,
  AntiGravityFlexProps,
  AntiGravityContainerProps,
  AntiGravitySectionProps,
  ResponsiveColumns,
} from './layout/AntiGravityLayout/AntiGravityLayout';

// ============================================================================
// 數據綁定組件
// ============================================================================

export {
  TwoWayBinding,
  Form,
  useTwoWayBinding,
} from './data-binding/TwoWayBinding/TwoWayBinding';

export type {
  TwoWayBindingProps,
  FormProps,
  BindingOptions,
  BindingResult,
  InputType,
  ValidationRule,
} from './data-binding/TwoWayBinding/TwoWayBinding';

// ============================================================================
// 組件示例
// ============================================================================

export {
  UserProfileCardExample,
  ProductListExample,
  RegistrationFormExample,
  DataProcessingFlowExample,
  CompletePageExample,
} from './examples/ComponentExamples';
