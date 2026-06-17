// src/components/AtomicLibrary/atoms/OmniCard.tsx
import React from 'react';

interface OmniCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const OmniCard: React.FC<OmniCardProps> = ({
  title,
  children,
  className = '',
  onClick,
  selected = false,
}) => {
  const baseClasses = `
    p-4 rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  const themeClasses = selected
    ? 'bg-theme-primary/10 border-theme-primary'
    : 'bg-theme-surface-glass border-theme-border hover:bg-theme-surface-glass-hover';

  const classes = `${baseClasses} ${themeClasses} ${className}`;

  return (
    <div className={classes} onClick={onClick} role={onClick ? 'button' : undefined}>
      {title && <h3 className="text-body font-semibold mb-2 text-theme-primary">{title}</h3>}
      {children}
    </div>
  );
};
