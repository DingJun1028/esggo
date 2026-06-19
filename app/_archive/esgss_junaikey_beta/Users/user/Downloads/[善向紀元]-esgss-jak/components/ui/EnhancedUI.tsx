// 增強的UI元件
import React, { useState, useEffect, useCallback } from 'react';
import { Language } from '../../types';
import {
  Loader2, AlertCircle, CheckCircle, X, Info, AlertTriangle,
  Eye, EyeOff, RefreshCw, ChevronDown, ChevronUp, Search,
  Clock, Calendar, User, Mail, Phone, MapPin
} from 'lucide-react';
import { useResponsive, useAnimationPreferences } from '../../hooks/useResponsive';
import { useAccessibility } from '../../hooks/useAccessibility';

// 增強的載入元件
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  language: Language;
  overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  language,
  overlay = false
}) => {
  const { shouldAnimate, getAnimationDuration } = useAnimationPreferences();
  const isZh = language === 'zh-TW';

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const content = (
    <div className={`flex flex-col items-center gap-3 ${overlay ? 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center' : ''}`}>
      <div className="relative">
        <Loader2
          className={`${sizeClasses[size]} text-blue-500 ${shouldAnimate() ? 'animate-spin' : ''}`}
          style={{ animationDuration: shouldAnimate() ? '1s' : '0s' }}
        />
        {shouldAnimate() && (
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin"
               style={{ animationDuration: '1s', animationDirection: 'reverse' }} />
        )}
      </div>
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  return overlay ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      {content}
    </div>
  ) : content;
};

// 骨架屏元件
export interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = ''
}) => {
  const { shouldAnimate } = useAnimationPreferences();

  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${shouldAnimate() ? 'animate-pulse' : ''} ${className}`}
      style={style}
      role="presentation"
      aria-hidden="true"
    />
  );
};

// 增強的按鈕元件
export interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  language: Language;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  language,
  className = '',
  ...props
}) => {
  const { getTouchTargetSize } = useResponsive();
  const { settings } = useAccessibility();
  const { shouldAnimate } = useAnimationPreferences();
  const isZh = language === 'zh-TW';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'bg-transparent border-2 border-current text-current hover:bg-current hover:text-white focus:ring-current'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const touchSize = getTouchTargetSize(44);
  const buttonStyle: React.CSSProperties = {};
  if (settings.largeText) {
    buttonStyle.minHeight = touchSize;
    buttonStyle.fontSize = '1.125rem';
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${shouldAnimate() ? 'transform hover:scale-105 active:scale-95' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      style={buttonStyle}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {icon && !loading && icon}
      {children}
    </button>
  );
};

// 增強的輸入框元件
export interface EnhancedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  language: Language;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  fullWidth = false,
  className = '',
  language,
  id,
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputId] = useState(id || `input-${Math.random().toString(36).substr(2, 9)}`);
  const { settings } = useAccessibility();
  const isZh = language === 'zh-TW';

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const inputClasses = `
    block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${error ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'}
    ${startIcon ? 'pl-10' : ''}
    ${endIcon || type === 'password' ? 'pr-10' : ''}
    ${settings.largeText ? 'text-lg py-3' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium mb-1 ${settings.largeText ? 'text-base' : ''} ${error ? 'text-red-700' : 'text-gray-700'}`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIcon}
          </div>
        )}

        <input
          id={inputId}
          type={inputType}
          className={inputClasses}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          aria-invalid={!!error}
          {...props}
        />

        {(endIcon || type === 'password') && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {type === 'password' ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                aria-label={showPassword ? (isZh ? '隱藏密碼' : 'Hide password') : (isZh ? '顯示密碼' : 'Show password')}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            ) : (
              endIcon
            )}
          </div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

// 增強的下拉選單元件
export interface EnhancedSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  fullWidth?: boolean;
  language: Language;
}

export const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  fullWidth = false,
  className = '',
  language,
  id,
  ...props
}) => {
  const [selectId] = useState(id || `select-${Math.random().toString(36).substr(2, 9)}`);
  const { settings } = useAccessibility();

  const selectClasses = `
    block w-full px-3 py-2 border rounded-md shadow-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${error ? 'border-red-300 text-red-900' : 'border-gray-300'}
    ${settings.largeText ? 'text-lg py-3' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={selectId}
          className={`block text-sm font-medium mb-1 ${settings.largeText ? 'text-base' : ''} ${error ? 'text-red-700' : 'text-gray-700'}`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className={selectClasses}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={`${selectId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

// 通知元件
export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  language: Language;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
  language
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { shouldAnimate } = useAnimationPreferences();
  const isZh = language === 'zh-TW';

  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, isVisible, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-800 dark:text-green-200',
      iconColor: 'text-green-600'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      iconColor: 'text-red-600'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      iconColor: 'text-yellow-600'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-800 dark:text-blue-200',
      iconColor: 'text-blue-600'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`
        ${config.bgColor} ${config.borderColor} border-l-4 p-4 rounded-r-lg shadow-sm
        ${shouldAnimate() ? 'animate-in slide-in-from-right-full duration-300' : ''}
      `}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>

        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${config.textColor}`}>
            {title}
          </h3>
          {message && (
            <p className={`mt-1 text-sm ${config.textColor} opacity-90`}>
              {message}
            </p>
          )}
        </div>

        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className={`ml-4 inline-flex ${config.textColor} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded`}
            aria-label={isZh ? '關閉通知' : 'Close notification'}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// 增強的模態框元件
export interface EnhancedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  language: Language;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export const EnhancedModal: React.FC<EnhancedModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  language,
  closeOnOverlayClick = true,
  showCloseButton = true
}) => {
  const { shouldAnimate } = useAnimationPreferences();
  const { pushFocus, popFocus } = useAccessibility();
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      pushFocus(modalRef.current);
    }

    return () => {
      if (isOpen) {
        popFocus();
      }
    };
  }, [isOpen, pushFocus, popFocus]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        shouldAnimate() ? 'animate-in fade-in duration-200' : ''
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* 模態框內容 */}
      <div
        ref={modalRef}
        className={`
          relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses[size]}
          ${shouldAnimate() ? 'animate-in zoom-in-95 duration-200' : ''}
        `}
        tabIndex={-1}
      >
        {/* 標題欄 */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={language === 'zh-TW' ? '關閉' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* 內容 */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};