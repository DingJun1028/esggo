import React from 'react';
import { motion } from 'framer-motion';

// Simplistic low-poly World Map SVG Data (Mercator-ish)
// In a real app, use a proper TopoJSON/GeoJSON library or a detailed SVG component.
// For this visual prototype, we use a stylized representation.

const locations = [
    { id: 'us', x: 25, y: 35, name: 'North America', impact: 85 },
    { id: 'br', x: 32, y: 65, name: 'South America', impact: 45 },
    { id: 'eu', x: 52, y: 30, name: 'Europe', impact: 92 },
    { id: 'af', x: 55, y: 55, name: 'Africa', impact: 30 },
    { id: 'asia', x: 75, y: 35, name: 'Asia', impact: 78 },
    { id: 'au', x: 85, y: 75, name: 'Oceania', impact: 55 },
];

export const GeoHeatmapChart: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden h-[400px] flex flex-col"
        >
            <div className="flex justify-between items-center mb-4 z-10 relative">
                <h3 className="text-white/90 font-bold text-lg tracking-tight flex items-center gap-2">
                    <span className="w-1 h-6 bg-rose-500 rounded-full shadow-[0_0_10px_#f43f5e]" />
                    Global Impact Reach
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        Live Data
                    </div>
                </div>
            </div>

            <div className="relative w-full h-full flex items-center justify-center">
                {/* World Map SVG Background */}
                <svg viewBox="0 0 100 50" className="w-full h-full opacity-30 pointer-events-none">
                    {/* Abstract Continents - Paths are approximated for visual aesthetics */}
                    <path d="M10,10 Q25,5 40,10 T30,40 z" fill="#fff" /> {/* N. America */}
                    <path d="M35,45 Q40,55 30,70 T25,50 z" fill="#fff" transform="scale(1, 0.8) translate(0, 10)" /> {/* S. America */}
                    <path d="M45,10 Q50,5 60,10 L60,25 Q50,30 45,20 z" fill="#fff" /> {/* Europe */}
                    <path d="M48,25 Q60,25 65,40 Q55,55 45,40 z" fill="#fff" /> {/* Africa */}
                    <path d="M65,10 L90,10 L85,35 Q75,40 65,25 z" fill="#fff" /> {/* Asia */}
                    <path d="M80,50 Q90,50 85,60 z" fill="#fff" /> {/* Australia */}
                </svg>

                {/* CSS-based Grid Map (Simulated for clearer location placement if SVG paths are too abstract) */}
                <div className="absolute inset-0">
                    {locations.map((loc) => (
                        <motion.div
                            key={loc.id}
                            className="absolute w-4 h-4 -ml-2 -mt-2 group cursor-pointer"
                            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                            whileHover={{ scale: 1.5 }}
                        >
                            {/* Pulsing Beacon */}
                            <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white/20 shadow-[0_0_15px_#f43f5e]" />

                            {/* Tooltip */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block z-50 whitespace-nowrap bg-black/90 text-white p-3 rounded-lg border border-rose-500/30 backdrop-blur-md">
                                <p className="font-bold text-rose-400 mb-1">{loc.name}</p>
                                <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden mb-1">
                                    <div className="h-full bg-rose-500" style={{ width: `${loc.impact}%` }} />
                                </div>
                                <p className="text-[10px] text-gray-400 font-mono">Impact Score: {loc.impact}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Decorative Grid Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        </motion.div>
    );
};
