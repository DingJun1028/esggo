import React from 'react';
import { useTouchDevice, useBreakpoint } from '../../src/utils/responsive';
import { cn } from '../../src/utils/responsive';

// 觸控友好的按鈕組件
export const TouchButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  haptic?: boolean;
}> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className,
  haptic = true
}) => {
  const isTouchDevice = useTouchDevice();

  const handleClick = () => {
    if (haptic && isTouchDevice && 'vibrate' in navigator) {
      navigator.vibrate(50); // 輕微震動回饋
    }
    onClick?.();
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    ghost: 'bg-transparent hover:bg-white/10 text-white border border-white/20'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[44px]', // 最小觸控區域 44px
    md: 'px-4 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]'
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isTouchDevice && 'active:scale-95', // 觸控按下效果
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
};

// 觸控友好的卡片組件
export const TouchCard: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}> = ({ children, onClick, className, padding = 'md', hover = true }) => {
  const isTouchDevice = useTouchDevice();

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl',
        'transition-all duration-200',
        paddingClasses[padding],
        hover && !isTouchDevice && 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]',
        onClick && 'cursor-pointer',
        isTouchDevice && onClick && 'active:scale-95', // 觸控按下效果
        className
      )}
    >
      {children}
    </div>
  );
};

// 觸控優化的滑動區域
export const TouchScrollable: React.FC<{
  children: React.ReactNode;
  className?: string;
  direction?: 'vertical' | 'horizontal' | 'both';
  showScrollbar?: boolean;
}> = ({ children, className, direction = 'vertical', showScrollbar = false }) => {
  const scrollClasses = {
    vertical: 'overflow-y-auto',
    horizontal: 'overflow-x-auto',
    both: 'overflow-auto'
  };

  const scrollbarClasses = showScrollbar
    ? ''
    : 'scrollbar-hide'; // 需要在 CSS 中定義 .scrollbar-hide

  return (
    <div
      className={cn(
        scrollClasses[direction],
        scrollbarClasses,
        // 改善 iOS Safari 滾動
        'webkit-overflow-scrolling-touch',
        className
      )}
    >
      {children}
    </div>
  );
};

// 觸控優化的輸入組件
export const TouchInput: React.FC<{
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
}> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
  autoComplete,
  inputMode
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      inputMode={inputMode}
      className={cn(
        'w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg',
        'text-white placeholder-white/50',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'min-h-[48px] text-base', // 防止 iOS 縮放
        className
      )}
    />
  );
};

// 觸控優化的選擇器
export const TouchSelect: React.FC<{
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
}> = ({ value, onChange, children, className }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={cn(
        'w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg',
        'text-white appearance-none',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'min-h-[48px] text-base',
        'bg-no-repeat bg-right bg-[length:16px_16px]',
        'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")]',
        className
      )}
    >
      {children}
    </select>
  );
};

// 觸控優化的滑動指示器
export const TouchIndicator: React.FC<{
  visible?: boolean;
  position?: 'left' | 'right' | 'top' | 'bottom';
}> = ({ visible = true, position = 'right' }) => {
  if (!visible) return null;

  const positionClasses = {
    left: '-left-2 top-1/2 -translate-y-1/2',
    right: '-right-2 top-1/2 -translate-y-1/2',
    top: 'top-2 left-1/2 -translate-x-1/2',
    bottom: 'bottom-2 left-1/2 -translate-x-1/2'
  };

  const rotationClasses = {
    left: 'rotate-180',
    right: '',
    top: 'rotate-90',
    bottom: '-rotate-90'
  };

  return (
    <div className={cn(
      'absolute w-8 h-8 flex items-center justify-center',
      positionClasses[position]
    )}>
      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
        <svg
          className={cn('w-3 h-3 text-white/60', rotationClasses[position])}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

// 長按功能 Hook
export const useLongPress = (
  onLongPress: () => void,
  onClick: () => void,
  { threshold = 500, onStart, onFinish } = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = React.useState(false);
  const timeout = React.useRef<NodeJS.Timeout>();
  const target = React.useRef<EventTarget>();

  const start = React.useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      event.preventDefault();
      onStart?.();

      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      setLongPressTriggered(false);
      timeout.current = setTimeout(() => {
        onLongPress();
        setLongPressTriggered(true);
      }, threshold);
    },
    [onLongPress, onStart, threshold]
  );

  const clear = React.useCallback(
    (event: React.TouchEvent | React.MouseEvent, shouldTriggerClick = true) => {
      event.preventDefault();
      onFinish?.();

      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      if (shouldTriggerClick && !longPressTriggered) {
        onClick();
      }
    },
    [onClick, onFinish, longPressTriggered]
  );

  return {
    onMouseDown: (e: React.MouseEvent) => start(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent) => clear(e)
  };
};

// 觸控優化的上下文選單
export const TouchContextMenu: React.FC<{
  children: React.ReactNode;
  items: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    destructive?: boolean;
  }>;
  visible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}> = ({ children, items, visible, position, onClose }) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return <>{children}</>;

  return (
    <>
      {children}
      <div
        ref={menuRef}
        className="fixed z-50 bg-slate-800 border border-white/20 rounded-lg shadow-xl py-2 min-w-[200px]"
        style={{
          left: Math.min(position.x, window.innerWidth - 220),
          top: Math.min(position.y, window.innerHeight - (items.length * 44 + 16))
        }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={cn(
              'w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/10 transition-colors',
              'min-h-[44px]', // 最小觸控區域
              item.destructive && 'text-red-400 hover:bg-red-500/20'
            )}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};