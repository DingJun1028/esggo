/**
 * ESGGO OmniComponent Type Definitions - v1.1
 * ESGGO Classic 善向永續 經典版
 */

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface OmniColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    disabled: string;
    inverse: string;
  };
  brand: {
    primary: string;
    accent: string;
    secondary: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  surface: {
    glass: string;
    border: string;
    divider: string;
  };
}

// Component Types
export type ComponentType = 'atom' | 'molecule' | 'organism' | 'template';

export type ComponentVariant = 
  | 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'glass'
  | 'default' | 'filled' | 'outlined';

export type ComponentSize = 
  | 'xl' | 'lg' | 'md' | 'sm' | 'xs'
  | 'icon' | 'full';

export type ComponentState = 
  | 'default' | 'hover' | 'focus' | 'active' | 'disabled' | 'loading' | 'error';

// 5T Dimension Types
export interface TDimension {
  tangible: boolean;
  traceable: boolean;
  trackable: boolean;
  transparent: boolean;
  trustworthy: boolean;
}

export type TState = 'pending' | 'processing' | 'passed' | 'sealed';

// Base Component Props
export interface BaseOmniProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  state?: ComponentState;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

// Button Types
export const buttonVariants = ['primary', 'secondary', 'ghost', 'danger', 'success', 'glass'] as const;
export type ButtonVariant = typeof buttonVariants[number];

export const buttonSizes = ['xl', 'lg', 'md', 'sm', 'xs', 'icon'] as const;
export type ButtonSize = typeof buttonSizes[number];

export interface OmniButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loadingText?: string;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Input Types
export const inputVariants = ['default', 'filled', 'outlined'] as const;
export type InputVariant = typeof inputVariants[number];

export interface OmniInputProps {
  variant?: InputVariant;
  size?: 'lg' | 'md' | 'sm';
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputMode?: 'text' | 'numeric' | 'email' | 'tel' | 'decimal';
  enterKeyHint?: 'done' | 'next' | 'search' | 'send';
  showClearButton?: boolean;
  mobile?: boolean;
}

// Badge Types
export const badgeVariants = ['default', 't1', 't2', 't3', 't4', 't5', 'verified', 'warning', 'error', 'info'] as const;
export type BadgeVariant = typeof badgeVariants[number];

export interface OmniBadgeProps {
  variant?: BadgeVariant;
  shape?: 'rounded' | 'pill' | 'square';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Card Types
export const cardVariants = ['default', 'glass', 'elevated'] as const;
export type CardVariant = typeof cardVariants[number];

export interface OmniCardProps {
  variant?: CardVariant;
  padding?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Modal Types
export interface OmniModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'default' | 'lg' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  mobileFullscreen?: boolean;
  className?: string;
}

// Mobile Specific Types
export interface MobileBottomNavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number | string;
  onPress?: () => void;
}

export interface MobileBottomNavProps extends BaseOmniProps {
  items: MobileBottomNavItem[];
  showLabels?: boolean;
  floatingActionButton?: React.ReactNode;
}

export interface MobileDrawerProps extends BaseOmniProps {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  width?: number | string;
}

export interface TouchGestureProps {
  onTap?: () => void;
  onLongPress?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

// Layout Types
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface OmniPageTemplateProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Theme Context Types
export interface OmniThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colors: OmniColors;
  isMobile: boolean;
}

// Responsive Types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveValues<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// Animation Types
export interface OmniAnimation {
  duration: number;
  easing: string;
  delay?: number;
}

// Accessibility Types
export interface A11yProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | true;
  role?: string;
}

// Governance Types (5T Integration)
export interface GovernanceBadge {
  type: TState;
  label: string;
  timestamp?: string;
  hash?: string;
}

export interface GovernanceProps {
  governance: GovernanceBadge[];
  onGovernanceClick?: (type: TState) => void;
}

// OmniAgentBus Integration Types
export interface OmniAgentBusWidgetProps {
  will: string;
  notifications?: GovernanceBadge[];
  showHistory?: boolean;
  onWillChange?: (will: string) => void;
}