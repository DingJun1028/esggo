import React, { memo, useMemo } from 'react';
import { type AgentDNA } from '@/types';

// ==================== CONSTANTS ====================
const MAX_STAT_VALUE = 100;
const CHART_RADIUS_RATIO = 0.7; // Use 70% of space for chart
const RING_PERCENTAGES = [0.25, 0.5, 0.75] as const;

interface AttributeConfig {
  readonly key: keyof AgentDNA;
  readonly label: string;
  readonly value: number;
  readonly color: string;
}

const ATTRIBUTE_COLORS: Record<keyof AgentDNA, string> = {
  intelligence: '#3B82F6', // Blue
  creativity: '#A855F7', // Purple
  empathy: '#EC4899', // Pink
  resilience: '#10B981', // Green
  precision: '#F59E0B', // Orange
  speed: '#EAB308', // Yellow
} as const;

// ==================== TYPE DEFINITIONS ====================
interface AttributeHexagonProps {
  readonly dna: AgentDNA;
  readonly size?: number;
  readonly showLabels?: boolean;
  readonly className?: string;
}

interface Point {
  readonly x: number;
  readonly y: number;
}

// ==================== UTILITY FUNCTIONS ====================
const normalizeValue = (value: number, max: number): number => {
  return Math.min(Math.max(value, 0), max) / max;
};

const calculatePoint = (
  center: number,
  radius: number,
  index: number,
  valRatio: number = 1
): Point => {
  const angle = (Math.PI / 3) * index - Math.PI / 2; // Start at 12 o'clock
  const r = radius * valRatio;
  return {
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle),
  };
};

const pointsToString = (points: Point[]): string => {
  return points.map(p => `${p.x},${p.y}`).join(' ');
};

// ==================== SUB-COMPONENTS ====================
interface HexagonLayerProps {
  readonly points: string;
  readonly fill: string;
  readonly stroke: string;
  readonly strokeWidth?: string | number;
  readonly strokeDasharray?: string;
  readonly className?: string;
}

const HexagonLayer = memo<HexagonLayerProps>(
  ({ points, fill, stroke, strokeWidth = '1', strokeDasharray, className }) => (
    <polygon
      points={points}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      className={className}
    />
  )
);

HexagonLayer.displayName = 'HexagonLayer';

interface AttributeLabelProps {
  readonly attribute: AttributeConfig;
  readonly center: number;
  readonly radius: number;
  readonly index: number;
}

const AttributeLabel = memo<AttributeLabelProps>(({ attribute, center, radius, index }) => {
  const labelRadius = radius + 20;
  const { x, y } = calculatePoint(center, labelRadius, index);

  const style: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div style={style} className="flex flex-col items-center pointer-events-none">
      <span className="text-[10px] font-bold text-gray-400 tracking-wider">{attribute.label}</span>
      <span className="text-xs font-mono font-bold text-cyan-400">
        {Math.round(attribute.value)}
      </span>
    </div>
  );
});

AttributeLabel.displayName = 'AttributeLabel';

// ==================== MAIN COMPONENT ====================
export const AttributeHexagon = memo<AttributeHexagonProps>(
  ({ dna, size = 200, showLabels = true, className = '' }) => {
    const center = size / 2;
    const radius = (size / 2) * CHART_RADIUS_RATIO;

    const attributes = useMemo<AttributeConfig[]>(
      () => [
        {
          key: 'intelligence',
          label: 'INT',
          value: dna.intelligence,
          color: ATTRIBUTE_COLORS.intelligence,
        },
        {
          key: 'creativity',
          label: 'CRT',
          value: dna.creativity,
          color: ATTRIBUTE_COLORS.creativity,
        },
        { key: 'empathy', label: 'EMP', value: dna.empathy, color: ATTRIBUTE_COLORS.empathy },
        {
          key: 'resilience',
          label: 'RES',
          value: dna.resilience,
          color: ATTRIBUTE_COLORS.resilience,
        },
        { key: 'precision', label: 'PRC', value: dna.precision, color: ATTRIBUTE_COLORS.precision },
        { key: 'speed', label: 'SPD', value: dna.speed, color: ATTRIBUTE_COLORS.speed },
      ],
      [dna]
    );

    const dataPoints = useMemo(() => {
      const points = attributes.map((attr, index) => {
        const valRatio = normalizeValue(attr.value, MAX_STAT_VALUE);
        return calculatePoint(center, radius, index, valRatio);
      });
      return pointsToString(points);
    }, [attributes, center, radius]);

    const backgroundPoints = useMemo(() => {
      const points = attributes.map((_, index) => calculatePoint(center, radius, index));
      return pointsToString(points);
    }, [attributes, center, radius]);

    const ringPoints = useMemo(() => {
      return RING_PERCENTAGES.map(percentage => {
        const points = attributes.map((_, index) =>
          calculatePoint(center, radius, index, percentage)
        );
        return pointsToString(points);
      });
    }, [attributes, center, radius]);

    const valueCircles = useMemo(() => {
      return attributes.map((attr, index) => {
        const valRatio = normalizeValue(attr.value, MAX_STAT_VALUE);
        const point = calculatePoint(center, radius, index, valRatio);
        return { ...point, key: attr.key };
      });
    }, [attributes, center, radius]);

    const gridLines = useMemo(() => {
      return attributes.map((_, index) => {
        const endPoint = calculatePoint(center, radius, index);
        return { index, endPoint };
      });
    }, [attributes, center, radius]);

    return (
      <div
        className={`relative flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label="Agent attribute hexagon chart"
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
          aria-hidden="true"
        >
          {/* Background Grid */}
          <HexagonLayer points={backgroundPoints} fill="rgba(30, 41, 59, 0.5)" stroke="#334155" />

          {/* Ring Guides */}
          {ringPoints.map((points, i) => (
            <HexagonLayer
              key={i}
              points={points}
              fill="none"
              stroke="#334155"
              strokeDasharray="4 4"
              strokeWidth="0.5"
            />
          ))}

          {/* Radial Connection Lines */}
          {gridLines.map(({ index, endPoint }) => (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="#334155"
              strokeWidth="0.5"
            />
          ))}

          {/* Data Polygon */}
          <HexagonLayer
            points={dataPoints}
            fill="rgba(6, 182, 212, 0.2)"
            stroke="#06B6D4"
            strokeWidth="2"
            className="drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-500 ease-out"
          />

          {/* Value Indicators */}
          {valueCircles.map(circle => (
            <circle
              key={circle.key}
              cx={circle.x}
              cy={circle.y}
              r="3"
              fill="#06B6D4"
              stroke="white"
              strokeWidth="1"
              className="transition-all duration-500 ease-out"
            />
          ))}
        </svg>

        {/* Labels Overlay */}
        {showLabels &&
          attributes.map((attr, index) => (
            <AttributeLabel
              key={attr.key}
              attribute={attr}
              center={center}
              radius={radius}
              index={index}
            />
          ))}
      </div>
    );
  }
);

AttributeHexagon.displayName = 'AttributeHexagon';
