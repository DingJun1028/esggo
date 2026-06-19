import React from 'react';
import { motion } from 'framer-motion';

interface Node {
    id: string;
    x: number;
    y: number;
    label: string;
    isCompleted?: boolean;
}

interface LearningJourneySVGProps {
    nodes: Node[];
    activeNodeId?: string;
}

export const LearningJourneySVG: React.FC<LearningJourneySVGProps> = ({ nodes, activeNodeId }) => {
    // Generate path data
    const pathD = nodes.reduce((acc, node, i) => {
        return i === 0 ? `M ${node.x} ${node.y}` : `${acc} L ${node.x} ${node.y}`;
    }, '');

    return (
        <div className="relative w-full h-full min-h-[400px]">
            <svg className="w-full h-full overflow-visible">
                {/* Background Connection Path (Ghosted) */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="rgba(129, 216, 208, 0.1)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Animated Progress Path (Tiffany Blue) */}
                <motion.path
                    d={pathD}
                    fill="none"
                    stroke="#81D8D0"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(129, 216, 208, 0.4))' }}
                />

                {/* Nodes (Refraction Points) */}
                {nodes.map((node) => {
                    const isActive = node.id === activeNodeId;
                    const isCompleted = node.isCompleted;

                    return (
                        <g key={node.id}>
                            {/* Outer Glow for Completed/Active */}
                            {(isActive || isCompleted) && (
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="12"
                                    fill={isCompleted ? "rgba(212, 175, 55, 0.2)" : "rgba(129, 216, 208, 0.2)"}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                />
                            )}

                            {/* Node Circle */}
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r="6"
                                className="fill-bg stroke-2"
                                style={{
                                    stroke: isCompleted ? "#D4AF37" : "#81D8D0",
                                    fill: "var(--color-bg)",
                                }}
                            />

                            {/* Label */}
                            <foreignObject
                                x={node.x - 50}
                                y={node.y + 15}
                                width="100"
                                height="40"
                                className="overflow-visible"
                            >
                                <div
                                    className={`text-center text-xs font-medium px-2 py-1 rounded-full transition-all duration-300
                    ${isActive ? 'bg-primary/20 text-primary' : 'text-secondary/60'}
                  `}
                                    style={{
                                        color: isCompleted ? '#D4AF37' : '',
                                        textShadow: isActive ? '0 0 10px rgba(129, 216, 208, 0.3)' : ''
                                    }}
                                >
                                    {node.label}
                                </div>
                            </foreignObject>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
