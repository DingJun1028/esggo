import React from 'react';

interface ReportsGridProps {
    children: React.ReactNode;
    className?: string;
}

export const ReportsGrid = ({ children, className = '' }: ReportsGridProps) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
            {children}
        </div>
    );
};
