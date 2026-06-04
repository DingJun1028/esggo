import React from 'react';
interface DataPoint {
    year: string;
    actual?: number;
    target: number;
    bau: number;
}
export declare function EnvironmentalTrajectory({ data, title, unit }: {
    data?: DataPoint[];
    title?: string;
    unit?: string;
}): React.JSX.Element;
export {};
//# sourceMappingURL=EnvironmentalTrajectory.d.ts.map