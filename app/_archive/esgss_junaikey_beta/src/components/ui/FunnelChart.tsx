import React from 'react';
import {
    Funnel,
    FunnelChart as RechartsFunnelChart,
    ResponsiveContainer,
    Tooltip,
    Cell,
    LabelList,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from './Chart';

interface FunnelData {
    name: string;
    value: number;
    fill: string;
    description?: string;
}

interface FunnelChartProps {
    data: FunnelData[];
    title?: string;
    height?: number;
}

const DEFAULT_DATA: FunnelData[] = [
    { name: 'Tangible (感知)', value: 100, fill: '#63a6b0', description: '數據採集與可視化' },
    { name: 'Traceable (溯源)', value: 80, fill: '#4a828a', description: '來源驗證與標註' },
    { name: 'Trackable (追蹤)', value: 60, fill: '#345e64', description: '生命週期監控' },
    { name: 'Transparent (透明)', value: 40, fill: '#1f3a3e', description: '算法公開與驗算' },
    { name: 'Trustworthy (誠信)', value: 20, fill: '#ffd700', description: '資產鎖定與封裝' },
];

export const FunnelChart: React.FC<FunnelChartProps> = ({
    data = DEFAULT_DATA,
    title = 'ESG 5T 轉型漏斗',
    height = 400
}) => {
    return (
        <div className="flex flex-col gap-4 w-full h-full p-4 rounded-xl bg-background/50 backdrop-blur-md border border-border/50">
            {title && (
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">
                        Omni-Sovereign Integration Matrix
                    </p>
                </div>
            )}
            <div style={{ width: '100%', height }}>
                <ResponsiveContainer>
                    <RechartsFunnelChart>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Funnel
                            data={data}
                            dataKey="value"
                            isAnimationActive
                        >
                            <LabelList
                                position="right"
                                fill="#888"
                                stroke="none"
                                dataKey="name"
                                className="text-xs font-medium"
                            />
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Funnel>
                    </RechartsFunnelChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                {data.map((item, idx) => (
                    <div key={idx} className="flex flex-col p-2 rounded-lg bg-secondary/30 border border-secondary/50">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                            <span className="text-xs font-bold text-foreground">{item.name}</span>
                        </div>
                        {item.description && (
                            <span className="text-[10px] text-muted-foreground mt-1">{item.description}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FunnelChart;
