import React from 'react';
import { WidgetConfig } from '../types';

interface WidgetConfigPanelProps {
    config: WidgetConfig;
    onChange: (config: WidgetConfig) => void;
}

export const WidgetConfigPanel: React.FC<WidgetConfigPanelProps> = () => {
    return <div className="p-4 border">Widget Config Panel Placeholder</div>;
};
