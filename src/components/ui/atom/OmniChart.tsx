import React from 'react';

interface OmniChartProps {
  title: string;
  data: Array<{ label: string; value: number }>;
  type?: 'bar' | 'line' | 'pie';
  height?: number;
  className?: string;
}

export const OmniChart: React.FC<OmniChartProps> = ({
  title,
  data,
  type = 'bar',
  height = 200,
  className = '',
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div className={`bg-theme-surface-glass rounded-lg p-4 ${className}`}>
      <h3 className="text-body font-semibold mb-4 text-theme-primary">{title}</h3>
      <div className="relative" style={{ height: `${height}px` }}>
        {type === 'bar' && (
          <div className="flex items-end justify-around h-full">
            {data.map((d, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="bg-theme-primary rounded-t"
                  style={{
                    height: `${(d.value / maxValue) * (height - 30)}px`,
                    width: `${barWidth}%`,
                  }}
                />
                <span className="text-caption mt-2">{d.label}</span>
              </div>
            ))}
          </div>
        )}
        {type === 'line' && (
          <svg viewBox={`0 0 100 ${height}`} className="w-full h-full">
            <polyline
              points={data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1)) * 100},${
                      height - (d.value / maxValue) * (height - 20)
                    }`
                )
                .join(' ')}
              fill="none"
              stroke="currentColor"
              className="text-theme-primary"
              strokeWidth="2"
            />
            {data.map((d, i) => (
              <text
                key={i}
                x={`${(i / (data.length - 1)) * 100}`}
                y={height - 5}
                className="text-caption fill-theme-muted"
              >
                {d.label}
              </text>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
};
