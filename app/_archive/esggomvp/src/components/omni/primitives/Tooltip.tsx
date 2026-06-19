import React, { useState } from 'react';

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactElement;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = 'top'
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={`
          absolute z-50 px-2 py-1 text-[10px] font-medium text-white bg-slate-900 border border-white/10 rounded shadow-xl whitespace-nowrap
          pointer-events-none transition-all duration-200
          ${positionClasses[position]}
        `}>
                    {content}
                    {/* Arrow */}
                    <div className="absolute w-1.5 h-1.5 bg-slate-900 border-b border-r border-white/10 rotate-45 -translate-x-1/2 left-1/2 -bottom-1" />
                </div>
            )}
        </div>
    );
};
