import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MeshNode } from '@/core/mesh/MeshProtocol';
import { meshDiscovery } from '@/core/mesh/MeshNodeDiscoveryService';

interface CosmicWebGraphProps {
    width?: number;
    height?: number;
}

const CosmicWebGraph: React.FC<CosmicWebGraphProps> = ({ width = 300, height = 200 }) => {
    const [nodes, setNodes] = useState<MeshNode[]>([]);

    useEffect(() => {
        // Initial fetch
        const fetchNodes = async () => {
            const peers = await meshDiscovery.discoverPeers();
            // Add self for visualization
            setNodes([
                { nodeId: 'self', publicKey: 'self', organizationId: 'Me', endpoint: '', reputation: 1.0 },
                ...peers
            ]);
        };

        fetchNodes();

        // Poll for updates (mock)
        const interval = setInterval(fetchNodes, 5000);
        return () => clearInterval(interval);
    }, []);

    // Simple layout: Self in center, peers in a circle
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    return (
        <div className="relative flex items-center justify-center" style={{ width, height }}>
            <svg width={width} height={height} className="absolute inset-0">
                <defs>
                    <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#63b3ed" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#3182ce" stopOpacity="0.0" />
                    </radialGradient>
                </defs>

                {/* Links */}
                {nodes.filter(n => n.nodeId !== 'self').map((node, i) => {
                    const angle = (i / (nodes.length - 1)) * 2 * Math.PI;
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);

                    return (
                        <motion.line
                            key={`link-self-${node.nodeId}`}
                            x1={centerX}
                            y1={centerY}
                            x2={x}
                            y2={y}
                            stroke="rgba(99, 179, 237, 0.3)"
                            strokeWidth="1"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    );
                })}

                {/* Nodes */}
                {nodes.map((node, i) => {
                    let x, y;
                    const isSelf = node.nodeId === 'self';

                    if (isSelf) {
                        x = centerX;
                        y = centerY;
                    } else {
                        // Adjust index for non-self nodes
                        const peerIndex = i - 1;
                        const angle = (peerIndex / (nodes.length - 1)) * 2 * Math.PI;
                        x = centerX + radius * Math.cos(angle);
                        y = centerY + radius * Math.sin(angle);
                    }

                    return (
                        <g key={node.nodeId}>
                            <motion.circle
                                cx={x}
                                cy={y}
                                r={isSelf ? 8 : 5}
                                fill={isSelf ? "#ffd700" : "#63b3ed"}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.1 }}
                            />
                            {/* Pulse Effect */}
                            <motion.circle
                                cx={x}
                                cy={y}
                                r={isSelf ? 8 : 5}
                                stroke={isSelf ? "#ffd700" : "#63b3ed"}
                                strokeWidth="1"
                                fill="none"
                                initial={{ scale: 1, opacity: 0.8 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <text x={x} y={y + 15} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">
                                {isSelf ? "Vault" : "Node"}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default CosmicWebGraph;
