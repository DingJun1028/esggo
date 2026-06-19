import React, { ReactNode } from 'react';

interface DashboardSectionProps {
    title: string;
    children: ReactNode;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({ title, children }) => {
    return (
        <div className="dashboard-section mb-6">
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            {children}
        </div>
    );
};
