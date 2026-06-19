"use client";

import React, { useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { TSupplier } from "@/lib/schemas/supply-chain-schemas";
import { motion, AnimatePresence } from "motion/react";
import { OmniBadge } from "@/components/omni-terminal/omni-badge";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface EmissionsHeatmapProps {
    suppliers: TSupplier[];
    onSupplierClick?: (supplier: TSupplier) => void;
}

export function EmissionsHeatmap({ suppliers, onSupplierClick }: EmissionsHeatmapProps) {
    const [hoveredSupplier, setHoveredSupplier] = useState<TSupplier | null>(null);

    // Color scale for emission intensity (Teal to Gold)
    const colorScale = scaleLinear<string>()
        .domain([0, 10000, 25000])
        .range(["#009E9D", "#EAB308", "#EF4444"]);

    return (
        <div className="relative w-full h-[500px] bg-matte-enterprise rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-minimal group">
            {/* Legend / Overlay */}
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                <OmniBadge label="GLOBAL_SUPPLY_CHAIN_HEATMAP" status="optimal" dot />
                <div className="bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-teal-start" />
                        <span className="text-[10px] font-black tracking-widest text-stone-500 uppercase">Low_Intensity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-gold" />
                        <span className="text-[10px] font-black tracking-widest text-stone-500 uppercase">Medium_Intensity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-error" />
                        <span className="text-[10px] font-black tracking-widest text-stone-500 uppercase">High_Intensity</span>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <ComposableMap
                projectionConfig={{
                    rotate: [-10, 0, 0],
                    scale: 147
                }}
                className="w-full h-full"
            >
                <ZoomableGroup zoom={1} maxZoom={3}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="#FFFFFF"
                                    stroke="#F5F5F4"
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: "#F5F5F5", outline: "none" },
                                        pressed: { fill: "#E7E5E4", outline: "none" }
                                    }}
                                />
                            ))
                        }
                    </Geographies>

                    {suppliers.map((supplier) => {
                        const isHighRisk = supplier.riskScore > 50;
                        const isMediumRisk = supplier.riskScore > 20 && !isHighRisk;
                        const radius = Math.sqrt(supplier.emissions.scope3Emissions / 100) + 3;
                        const markerColor = colorScale(supplier.emissions.scope3Emissions);

                        return (
                            <Marker
                                key={supplier.id}
                                coordinates={[supplier.coordinates?.lng || 0, supplier.coordinates?.lat || 0]}
                                onMouseEnter={() => setHoveredSupplier(supplier)}
                                onMouseLeave={() => setHoveredSupplier(null)}
                                onClick={() => onSupplierClick?.(supplier)}
                            >
                                <AnimatePresence>
                                    {(isHighRisk || isMediumRisk) && (
                                        <motion.circle
                                            r={radius + (isHighRisk ? 6 : 3)}
                                            fill={markerColor}
                                            initial={{ opacity: 0.4, scale: 0.8 }}
                                            animate={{
                                                opacity: [0.3, 0, 0],
                                                scale: [0.8, isHighRisk ? 2.5 : 1.8, isHighRisk ? 3 : 2]
                                            }}
                                            transition={{
                                                duration: isHighRisk ? 1.5 : 3,
                                                repeat: Infinity,
                                                ease: "easeOut"
                                            }}
                                        />
                                    )}
                                </AnimatePresence>
                                <motion.circle
                                    r={radius}
                                    fill={markerColor}
                                    fillOpacity={0.7}
                                    stroke={isHighRisk ? "#000" : markerColor}
                                    strokeWidth={isHighRisk ? 1.5 : 1}
                                    whileHover={{ scale: 1.5, fillOpacity: 1 }}
                                    className="cursor-pointer transition-all duration-300"
                                />
                            </Marker>
                        );
                    })}
                </ZoomableGroup>
            </ComposableMap>

            {/* Hover Tooltip */}
            <AnimatePresence>
                {hoveredSupplier && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-6 left-6 z-20 pointer-events-none"
                    >
                        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-2xl flex flex-col gap-1 min-w-[200px]">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-[9px] font-black uppercase text-stone-400 tracking-tighter">{hoveredSupplier.industry}</span>
                                <OmniBadge label={hoveredSupplier.status} status={hoveredSupplier.status === 'Strategic_Partner' ? 'optimal' : 'critical'} />
                            </div>
                            <h4 className="text-sm font-black text-black uppercase tracking-tight">{hoveredSupplier.name}</h4>
                            <div className="mt-2 flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Scope_3_Telemetry</p>
                                    <p className="text-lg font-black text-black tabular-nums">{hoveredSupplier.emissions.scope3Emissions.toLocaleString()} <span className="text-[9px] opacity-40">tCO2e</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Risk</p>
                                    <p className={`text-sm font-black ${hoveredSupplier.riskScore > 40 ? 'text-error' : 'text-primary-teal-start'}`}>{hoveredSupplier.riskScore}%</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Instruction Footer */}
            <div className="absolute bottom-6 right-6 opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Use Mouse Wheel to Zoom • Click Markers for Detailed Drills</span>
            </div>
        </div>
    );
}
