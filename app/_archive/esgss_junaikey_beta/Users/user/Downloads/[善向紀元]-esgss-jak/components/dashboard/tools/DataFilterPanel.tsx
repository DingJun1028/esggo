import React from 'react';
import { FilterConfig } from '../types';

interface DataFilterPanelProps {
    filters: FilterConfig[];
    onFilterChange: (filterId: string, value: any) => void;
}

export const DataFilterPanel: React.FC<DataFilterPanelProps> = ({ filters }) => {
    return (
        <div className="flex gap-2">
            {/* Placeholder */}
            <span className="text-sm text-gray-500">Filters</span>
        </div>
    );
};
