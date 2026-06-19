import React, { ReactNode } from 'react';
import { WidgetConfig } from '../types';

interface WidgetContainerProps {
    config: WidgetConfig;
    children: ReactNode;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({ config, children }) => {
    return (
        <div className="widget-container bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="widget-header flex justify-between items-center mb-4">
                <h4 className="font-medium">{config.title}</h4>
            </div>
            <div className="widget-content">
                {children}
            </div>
        </div>
    );
};
