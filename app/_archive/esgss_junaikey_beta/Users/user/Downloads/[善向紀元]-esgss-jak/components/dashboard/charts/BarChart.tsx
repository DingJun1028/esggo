// 柱狀圖組件
import React, { useMemo } from 'react';
import { ChartData, COLOR_PALETTES } from '../types';

interface BarChartProps {
  data: ChartData;
  width?: number;
  height?: number;
  colorPalette?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 400,
  height = 300,
  colorPalette = COLOR_PALETTES.default,
  showGrid = true,
  showLegend = true,
  animated = true,
  className = ''
}) => {
  const { maxValue, chartHeight, chartWidth, barWidth, barSpacing } = useMemo(() => {
    const values = data.datasets.flatMap(dataset => dataset.data.filter(v => v !== null) as number[]);
    const maxValue = Math.max(...values, 0);
    const chartHeight = height - 60; // 預留空間給標籤
    const chartWidth = width - 80; // 預留空間給Y軸
    const totalBars = data.labels.length * data.datasets.length;
    const availableWidth = chartWidth - (data.labels.length - 1) * 20; // 組間間距
    const barWidth = Math.max(8, availableWidth / totalBars);
    const barSpacing = 2;

    return { maxValue, chartHeight, chartWidth, barWidth, barSpacing };
  }, [data, width, height]);

  const renderBar = (
    value: number,
    index: number,
    datasetIndex: number,
    labelIndex: number,
    color: string
  ) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = 60 + labelIndex * (data.datasets.length * (barWidth + barSpacing) + 20) + datasetIndex * (barWidth + barSpacing);
    const y = height - 40 - barHeight;

    return (
      <rect
        key={`${datasetIndex}-${labelIndex}-${index}`}
        x={x}
        y={y}
        width={barWidth}
        height={barHeight}
        fill={color}
        className={animated ? 'transition-all duration-500 ease-out' : ''}
        style={{
          transformOrigin: `${x + barWidth / 2}px ${height - 40}px`,
          transform: animated ? 'scaleY(0)' : undefined,
          animation: animated ? `barGrow 0.5s ease-out ${index * 0.1}s forwards` : undefined
        }}
      />
    );
  };

  const renderGridLines = () => {
    if (!showGrid) return null;

    const gridLines = [];
    for (let i = 0; i <= 5; i++) {
      const y = height - 40 - (i * chartHeight) / 5;
      const value = (maxValue * i) / 5;

      gridLines.push(
        <g key={i}>
          <line
            x1={60}
            y1={y}
            x2={width - 20}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="1"
            opacity="0.5"
          />
          <text
            x={40}
            y={y + 4}
            textAnchor="end"
            fontSize="12"
            fill="#6b7280"
          >
            {value.toLocaleString()}
          </text>
        </g>
      );
    }

    return <g>{gridLines}</g>;
  };

  const renderLegend = () => {
    if (!showLegend) return null;

    return (
      <g>
        {data.datasets.map((dataset, index) => (
          <g key={index} transform={`translate(${60 + index * 120}, ${height - 20})`}>
            <rect
              x={0}
              y={0}
              width={12}
              height={12}
              fill={dataset.backgroundColor as string || colorPalette[index % colorPalette.length]}
              rx={2}
            />
            <text
              x={16}
              y={10}
              fontSize="12"
              fill="#374151"
            >
              {dataset.label}
            </text>
          </g>
        ))}
      </g>
    );
  };

  const renderXAxisLabels = () => (
    <g>
      {data.labels.map((label, index) => {
        const x = 60 + index * (data.datasets.length * (barWidth + barSpacing) + 20) + (data.datasets.length * (barWidth + barSpacing)) / 2;
        return (
          <text
            key={index}
            x={x}
            y={height - 20}
            textAnchor="middle"
            fontSize="12"
            fill="#6b7280"
            transform={`rotate(-45, ${x}, ${height - 20})`}
          >
            {label}
          </text>
        );
      })}
    </g>
  );

  return (
    <div className={`bar-chart ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* 網格線 */}
        {renderGridLines()}

        {/* 數據條 */}
        {data.datasets.map((dataset, datasetIndex) =>
          dataset.data.map((value, valueIndex) => {
            if (value === null) return null;
            const color = (dataset.backgroundColor as string) || colorPalette[datasetIndex % colorPalette.length] || '#CCCCCC';
            return renderBar(value, datasetIndex * data.labels.length + valueIndex, datasetIndex, valueIndex, color);
          })
        )}

        {/* X軸標籤 */}
        {renderXAxisLabels()}

        {/* 圖例 */}
        {renderLegend()}
      </svg>

      {/* CSS動畫 */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes barGrow {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
      `
      }} />
    </div>
  );
};