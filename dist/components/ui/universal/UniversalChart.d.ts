import React from 'react';
interface UniversalChartProps {
    data: any[];
    type?: 'area' | 'bar';
    xAxisKey: string;
    series: {
        key: string;
        name: string;
        color: string;
        gradient?: boolean;
    }[];
    height?: number;
}
export declare function UniversalChart({ data, type, xAxisKey, series, height }: UniversalChartProps): React.JSX.Element;
export {};
//# sourceMappingURL=UniversalChart.d.ts.map