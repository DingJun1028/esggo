import React from 'react';

interface TimeRange {
    start: number;
    end: number;
}

interface TimeRangeSelectorProps {
    value: TimeRange;
    onChange: (start: number, end: number) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value }) => {
    return (
        <div className="time-range-selector">
            <span className="text-sm text-gray-500">
                Time Range: {new Date(value.start).toLocaleDateString()} - {new Date(value.end).toLocaleDateString()}
            </span>
        </div>
    );
};
