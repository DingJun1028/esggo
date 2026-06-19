import React from 'react';
import { X } from 'lucide-react';

// --- Theme ---
export const glassTheme = {
  light: {
    text: '#1f2937',
    textSecondary: '#4b5563',
    background: '#ffffff',
    border: '#e5e7eb',
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    accent: '#8b5cf6',
  },
  dark: {
    text: '#f3f4f6',
    textSecondary: '#9ca3af',
    background: '#1f2937',
    border: '#374151',
    primary: '#60a5fa',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    accent: '#a78bfa',
  },
};

// --- Components ---

export const GlassCard = ({ theme, style, hover, clickable, onClick, children, ...props }: any) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: theme === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(30,30,40,0.6)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '16px',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const GlassButton = ({ theme, variant, onClick, children, ...props }: any) => {
  const isDark = theme === 'dark';
  let bg = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  let color = isDark ? '#fff' : '#000';

  if (variant === 'primary') {
    bg = '#3b82f6';
    color = '#fff';
  } else if (variant === 'secondary') {
    bg = 'transparent';
    color = isDark ? '#ccc' : '#555';
  } else if (variant === 'accent') {
    bg = '#8b5cf6';
    color = '#fff';
  }

  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600',
        background: bg,
        color,
        backdropFilter: 'blur(4px)',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export const GlassInput = ({ theme, style, ...props }: any) => {
  return (
    <input
      style={{
        padding: '10px 16px',
        borderRadius: '8px',
        border: `1px solid ${theme === 'light' ? '#ccc' : '#444'}`,
        background: theme === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.3)',
        color: theme === 'light' ? '#000' : '#fff',
        outline: 'none',
        ...style,
      }}
      {...props}
    />
  );
};

export const GlassModal = ({ isOpen, onClose, theme, size, children }: any) => {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(5px)',
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'relative',
          width: size === 'lg' ? '800px' : '500px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          background: theme === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(20,20,30,0.95)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          border: `1px solid ${theme === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: theme === 'light' ? '#000' : '#fff',
          }}
        >
          <X />
        </button>
        {children}
      </div>
    </div>
  );
};
