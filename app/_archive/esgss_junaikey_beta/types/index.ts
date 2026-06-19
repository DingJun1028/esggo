// ESGss JunAiKey - Base Types and Utilities
// Core type definitions for all ESG services

export type Language = 'zh-TW' | 'en';
export type Theme = 'light' | 'dark' | 'system';
export type ServiceStatus = 'active' | 'inactive' | 'maintenance';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface UserEntity extends BaseEntity {
  userId: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: Language;
  theme: Theme;
  notifications: NotificationSettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  frequency: 'realtime' | 'daily' | 'weekly';
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reducedMotion: boolean;
}

// Extended types for specific services
export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  role: string;
  company?: string;
}

export interface TrendData {
  metric: string;
  values: number[];
  timestamps: Date[];
  projection?: number[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  points: number;
}

// UI/UX specific types
export interface UIComponent {
  id: string;
  type: 'button' | 'card' | 'modal' | 'form' | 'chart' | 'table';
  variant: string;
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export interface LiquidGlassStyles {
  blur: number;
  opacity: number;
  borderColor: string;
  backgroundColor: string;
  shadowColor: string;
}

export interface ResponsiveBreakpoint {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  repeat?: number | 'infinite';
}

export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  neutral: string[];
}

export interface GlassTheme {
  light: ColorTheme & LiquidGlassStyles;
  dark: ColorTheme & LiquidGlassStyles;
}

// Navigation and Routing
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  children?: NavigationItem[];
  badge?: {
    count: number;
    color: string;
  };
  permissions?: string[];
}

export interface Breadcrumb {
  label: string;
  path?: string;
  active?: boolean;
}

// Form and Input Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: Option[];
  validation?: ValidationRule[];
  defaultValue?: any;
}

export interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

// Chart and Data Visualization
export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  type?: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar';
  fill?: boolean;
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: PluginConfig;
  scales?: ScaleConfig;
  animation?: AnimationConfig;
}

export interface PluginConfig {
  legend: {
    display: boolean;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
  tooltip: {
    enabled: boolean;
    format: string;
  };
}

export interface ScaleConfig {
  x?: AxisConfig;
  y?: AxisConfig;
}

export interface AxisConfig {
  beginAtZero: boolean;
  grid: {
    display: boolean;
  };
  ticks: {
    format: string;
  };
}

// Internationalization
export interface Translation {
  key: string;
  value: string;
  context?: string;
  plural?: boolean;
}

export interface Locale {
  code: string;
  name: string;
  rtl: boolean;
  translations: Record<string, Translation>;
}

// Accessibility
export interface AccessibilityFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  shortcut?: string;
}

export interface ScreenReaderConfig {
  enabled: boolean;
  voiceSpeed: number;
  language: string;
}

export interface KeyboardNavigation {
  enabled: boolean;
  shortcuts: KeyboardShortcut[];
}

export interface KeyboardShortcut {
  key: string;
  modifiers: ('ctrl' | 'alt' | 'shift')[];
  action: string;
  description: string;
}
