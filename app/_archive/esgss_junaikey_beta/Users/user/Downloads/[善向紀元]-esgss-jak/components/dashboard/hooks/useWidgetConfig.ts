import { useState } from 'react';
import { WidgetConfig } from '../types';

export const useWidgetConfig = (initialConfig: WidgetConfig) => {
    const [config, setConfig] = useState<WidgetConfig>(initialConfig);
    const updateConfig = (updates: Partial<WidgetConfig>) => {
        setConfig(prev => ({ ...prev, ...updates }));
    };
    return { config, updateConfig };
};
