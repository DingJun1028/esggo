/**
 * ESGGO OmniComponent Library - v1.1.0
 * ESGGO Classic 善向永續 經典版
 */

// Atom Components
export { OmniButton } from './atom/OmniButton';
export { OmniInput } from './atom/OmniInput';
export { OmniBadge } from './atom/OmniBadge';
export { OmniCard } from './atom/OmniCard';
export { OmniIcon } from './atom/OmniIcon';
export { OmniDivider } from './atom/OmniDivider';
export { OmniWeather } from './atom/OmniWeather';
export { OmniChart } from './atom/OmniChart';

// Molecule Components
export { OmniFormField } from './molecule/OmniFormField';
export { OmniKPICard } from './molecule/OmniKPICard';

// Organism Components
export { OmniModal } from './organism/OmniModal';
export { MatrixDashboard } from './organism/MatrixDashboard';

// Mobile Components
export { MobileBottomNav } from './mobile/MobileBottomNav';
export { MobileDrawer } from './mobile/MobileDrawer';

// Assistant Components
export { OmniAssistant } from '../assistant/OmniAssistant';

// Theme
export { OmniThemeProvider, useOmniTheme } from '../theme/OmniThemeProvider';
export { ThemeToggle } from '../theme/ThemeToggle';

// Hooks
export { useTouchGesture } from '../hooks/useTouchGesture';
export { useOAAgentBus } from '../hooks/useOAAgentBus';
export { omniAgentBus } from '../../services/OAAgentBus.client';
export type { IMiaoDeNotification } from '../../services/OAAgentBus.client';

// Types
export * from '../../types/omni-component';
export * from '../../types/omni-assistant';

// Factory
export {
  ComponentBuilder,
  FactoryRegistry,
  RequirementSheetSchema,
} from '../../lib/factory/omni-factory-builder';
