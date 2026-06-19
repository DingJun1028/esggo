// ESGss JunAiKey - Liquid Glass UI Components Library
// 極簡光學極致美學 + 液態玻璃風格 + 響應式設計

import React, { useState, useEffect, ReactNode, forwardRef } from 'react';
import { Theme, Language } from '../../types';

// ===== Liquid Glass Design System =====

// Base Glass Theme Configuration
export const glassTheme = {
  light: {
    background: 'rgba(255, 255, 255, 0.85)',
    backgroundHover: 'rgba(255, 255, 255, 0.95)',
    border: 'rgba(255, 255, 255, 0.18)',
    text: 'rgba(0, 0, 0, 0.87)',
    textSecondary: 'rgba(0, 0, 0, 0.6)',
    accent: '#00D4AA',
    primary: '#1A73E8',
    secondary: '#5F6368',
    error: '#EA4335',
    warning: '#FBBC04',
    success: '#34A853',
    blur: '20px',
    shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    shadowHover: '0 12px 48px 0 rgba(31, 38, 135, 0.45)',
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.75)',
    backgroundHover: 'rgba(0, 0, 0, 0.85)',
    border: 'rgba(255, 255, 255, 0.125)',
    text: 'rgba(255, 255, 255, 0.95)',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    accent: '#00D4AA',
    primary: '#8AB4F8',
    secondary: '#9AA0A6',
    error: '#F28B82',
    warning: '#FDD663',
    success: '#81C995',
    blur: '20px',
    shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    shadowHover: '0 12px 48px 0 rgba(0, 0, 0, 0.45)',
  },
};

// Responsive Breakpoints
export const breakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px',
};

// CSS-in-JS Helper Functions
const createGlassStyle = (theme: 'light' | 'dark', hover: boolean = false) => ({
  background:
    theme === 'light'
      ? glassTheme.light[hover ? 'backgroundHover' : 'background']
      : glassTheme.dark[hover ? 'backgroundHover' : 'background'],
  backdropFilter: `blur(${theme === 'light' ? glassTheme.light.blur : glassTheme.dark.blur})`,
  WebkitBackdropFilter: `blur(${theme === 'light' ? glassTheme.light.blur : glassTheme.dark.blur})`,
  borderRadius: '16px',
  border: `1px solid ${theme === 'light' ? glassTheme.light.border : glassTheme.dark.border}`,
  boxShadow:
    theme === 'light'
      ? hover
        ? glassTheme.light.shadowHover
        : glassTheme.light.shadow
      : hover
        ? glassTheme.dark.shadowHover
        : glassTheme.dark.shadow,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
});

const createButtonStyle = (
  theme: 'light' | 'dark',
  variant: 'primary' | 'secondary' | 'ghost' = 'primary'
) => {
  const colors = theme === 'light' ? glassTheme.light : glassTheme.dark;
  return {
    ...createGlassStyle(theme),
    padding: '12px 24px',
    borderRadius: '12px',
    border: variant === 'ghost' ? '1px solid transparent' : `1px solid ${colors.border}`,
    color: variant === 'primary' ? colors.accent : colors.text,
    backgroundColor: variant === 'ghost' ? 'transparent' : colors.background,
    fontWeight: 500,
    cursor: 'pointer',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minWidth: 'fit-content',
  };
};

const createInputStyle = (theme: 'light' | 'dark') => {
  const colors = theme === 'light' ? glassTheme.light : glassTheme.dark;
  return {
    ...createGlassStyle(theme),
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
    color: colors.text,
    backgroundColor: 'transparent',
    fontSize: '16px',
    outline: 'none',
  };
};

// ===== Core Components =====

// Glass Container Component
interface GlassContainerProps {
  children: ReactNode;
  theme?: 'light' | 'dark';
  variant?: 'card' | 'panel' | 'modal';
  hover?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event?: React.MouseEvent) => void;
}

export const GlassContainer = forwardRef<HTMLDivElement, GlassContainerProps>(
  (
    {
      children,
      theme = 'light',
      variant = 'card',
      hover = false,
      className = '',
      style = {},
      onClick,
    },
    ref
  ) => {
    const baseStyles = {
      ...createGlassStyle(theme),
      position: 'relative' as const,
      overflow: 'hidden' as const,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    };

    const variantStyles = {
      card: {
        ...baseStyles,
        padding: '24px',
      },
      panel: {
        ...baseStyles,
        padding: '32px',
        borderRadius: '20px',
      },
      modal: {
        ...baseStyles,
        padding: '48px',
        borderRadius: '24px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto' as const,
      },
    };

    const combinedStyles = {
      ...variantStyles[variant],
      ...(hover && {
        ':hover': {
          transform: 'translateY(-4px)',
          ...createGlassStyle(theme, true),
        },
      }),
    };

    return (
      <div
        ref={ref}
        className={className}
        style={combinedStyles}
        onClick={onClick}
        onMouseEnter={e => {
          if (hover) {
            e.currentTarget.style.transform = 'translateY(-4px)';
            Object.assign(e.currentTarget.style, createGlassStyle(theme, true));
          }
        }}
        onMouseLeave={e => {
          if (hover) {
            e.currentTarget.style.transform = 'translateY(0)';
            Object.assign(e.currentTarget.style, createGlassStyle(theme, false));
          }
        }}
      >
        {children}
      </div>
    );
  }
);

GlassContainer.displayName = 'GlassContainer';

// Glass Button Component
interface GlassButtonProps {
  children: ReactNode;
  onClick?: (event?: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      onClick,
      variant = 'primary',
      size = 'md',
      theme = 'light',
      disabled = false,
      loading = false,
      icon,
      className = '',
      style = {},
    },
    ref
  ) => {
    const colors = theme === 'light' ? glassTheme.light : glassTheme.dark;

    const sizeStyles = {
      sm: { padding: '8px 16px', fontSize: '14px' },
      md: { padding: '12px 24px', fontSize: '16px' },
      lg: { padding: '16px 32px', fontSize: '18px' },
    };

    const buttonStyles = {
      ...createButtonStyle(theme, variant),
      ...sizeStyles[size],
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style,
    };

    return (
      <button
        ref={ref}
        className={className}
        style={buttonStyles}
        onClick={disabled || loading ? undefined : onClick}
        disabled={disabled}
        onMouseEnter={e => {
          if (!disabled && !loading) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow =
              theme === 'light' ? glassTheme.light.shadowHover : glassTheme.dark.shadowHover;
          }
        }}
        onMouseLeave={e => {
          if (!disabled && !loading) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              theme === 'light' ? glassTheme.light.shadow : glassTheme.dark.shadow;
          }
        }}
        onMouseDown={e => {
          if (!disabled && !loading) {
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        {loading && (
          <div
            style={{
              width: '16px',
              height: '16px',
              border: `2px solid ${colors.textSecondary}`,
              borderTop: `2px solid ${colors.accent}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        )}
        {!loading && icon}
        {children}
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

// Glass Input Component
interface GlassInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  theme?: 'light' | 'dark';
  disabled?: boolean;
  error?: boolean;
  label?: string;
  icon?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  theme = 'light',
  disabled = false,
  error = false,
  label,
  icon,
  className = '',
  style = {},
}) => {
  const colors = theme === 'light' ? glassTheme.light : glassTheme.dark;

  const inputStyles = {
    ...createInputStyle(theme),
    borderColor: error ? colors.error : colors.border,
    paddingLeft: icon ? '48px' : '16px',
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  return (
    <div className={className}>
      {label && (
        <div
          style={{
            marginBottom: '8px',
            color: colors.text,
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div
            style={{
              position: 'absolute' as const,
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.textSecondary,
              zIndex: 1,
            }}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={inputStyles}
          onFocus={e => {
            if (!error) {
              e.target.style.borderColor = colors.accent;
              e.target.style.boxShadow = `0 0 0 3px ${colors.accent}33`;
            }
          }}
          onBlur={e => {
            if (!error) {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = 'none';
            }
          }}
        />
      </div>
    </div>
  );
};

// Glass Card Component
interface GlassCardProps {
  children: ReactNode;
  theme?: 'light' | 'dark';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  theme = 'light',
  hover = true,
  clickable = false,
  onClick,
  className = '',
  style = {},
}) => {
  return (
    <GlassContainer
      theme={theme}
      variant="card"
      hover={hover}
      onClick={clickable ? onClick : undefined}
      className={className}
      style={{
        cursor: clickable ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </GlassContainer>
  );
};

// Glass Modal Component
interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  children,
  theme = 'light',
  size = 'md',
  showCloseButton = true,
  className = '',
  style = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const sizeStyles = {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '600px' },
    lg: { maxWidth: '800px' },
    xl: { maxWidth: '1000px' },
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      onClick={handleClose}
    >
      <GlassContainer
        theme={theme}
        variant="modal"
        onClick={e => {
          e?.stopPropagation();
        }}
        style={{
          ...sizeStyles[size],
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          ...style,
        }}
        className={className}
      >
        {showCloseButton && (
          <button
            onClick={handleClose}
            style={{
              position: 'absolute' as const,
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color:
                theme === 'light' ? glassTheme.light.textSecondary : glassTheme.dark.textSecondary,
              borderRadius: '8px',
              padding: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background =
                theme === 'light'
                  ? glassTheme.light.backgroundHover
                  : glassTheme.dark.backgroundHover;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ×
          </button>
        )}
        {children}
      </GlassContainer>
    </div>
  );
};

// CSS Animations (inject into head)
export const glassAnimations = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-slide-in-right {
    animation: slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }
`;

export default {
  glassTheme,
  createGlassStyle,
  createButtonStyle,
  createInputStyle,
  glassAnimations,
  GlassContainer,
  GlassButton,
  GlassInput,
  GlassCard,
  GlassModal,
  breakpoints,
};
