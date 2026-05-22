'use client';
import React from 'react';

interface BrandAvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  status?: 'online' | 'offline' | 'busy';
  onClick?: () => void;
}

const sizeStyles = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const statusStyles = {
  online: 'bg-green-500',
  offline: 'bg-slate-400',
  busy: 'bg-amber-500',
};

export default function BrandAvatar({ name, src, size = 'md', color = '#003262', status, onClick }: BrandAvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div 
      className={`relative inline-flex flex-shrink-0 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {src ? (
        <img src={src} alt={name} className={`${sizeStyles[size]} rounded-full object-cover`} />
      ) : (
        <div
          className={`${sizeStyles[size]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
      )}
      {status && (
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${statusStyles[status]}`} />
      )}
    </div>
  );
}