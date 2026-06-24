// types/ui.ts
// UI 元件核心類型定義

export type Variant = 'default' | 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface CardProps extends BaseProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export interface ButtonProps extends BaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  error?: string;
  onChange?: (value: string) => void;
}

export interface BadgeProps extends BaseProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export interface NavItemProps extends BaseProps {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

export interface SectionHeaderProps extends BaseProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}
