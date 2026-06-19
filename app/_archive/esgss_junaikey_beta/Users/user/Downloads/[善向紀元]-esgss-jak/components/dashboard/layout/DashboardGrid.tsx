import React from 'react';
import { DashboardConfig, DashboardPermissions, WidgetConfig } from '../types';

interface DashboardGridProps {
    config: DashboardConfig;
    data: any;
    isEditMode: boolean;
    onWidgetUpdate: (id: string, config: Partial<WidgetConfig>) => void;
    onLayoutChange: (layout: any) => void;
    permissions: DashboardPermissions;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ config }) => {
    return (
        <div className="dashboard-grid p-4">
            <div className="text-gray-500 text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                Dashboard Grid Placeholder ({config.widgets.length} widgets)
            </div>
        </div>
    );
};
