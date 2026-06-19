"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from "@/components/ui/badge";
import { Search, Shield, AlertTriangle, CheckCircle, Fingerprint, Zap } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ConfidencePoint {
    bbox: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in percentages 0-100
    confidence: 'high' | 'medium' | 'low';
    label: string;
    agentId?: string;
    description?: string;
}

interface ConfidenceHeatmapProps {
    items: ConfidencePoint[];
    imageUrl?: string;
    className?: string;
    title?: string;
}

export const ConfidenceHeatmap: React.FC<ConfidenceHeatmapProps> = ({
    items,
    imageUrl,
    className,
    title = "Confidence Matrix Scan"
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoverItem, setHoverItem] = useState<ConfidencePoint | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        items.forEach(item => {
            if (!item.bbox) return;
            const [ymin, xmin, ymax, xmax] = item.bbox;

            const x = (xmin / 100) * canvas.width;
            const y = (ymin / 100) * canvas.height;
            const w = ((xmax - xmin) / 100) * canvas.width;
            const h = ((ymax - ymin) / 100) * canvas.height;

            let color = 'rgba(16, 185, 129, 0.1)';
            let stroke = 'rgba(16, 185, 129, 0.6)';

            if (item.confidence === 'medium') {
                color = 'rgba(245, 158, 11, 0.1)';
                stroke = 'rgba(245, 158, 11, 0.6)';
            } else if (item.confidence === 'low') {
                color = 'rgba(239, 68, 68, 0.1)';
                stroke = 'rgba(239, 68, 68, 0.6)';
            }

            ctx.fillStyle = color;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 3]);
            ctx.strokeRect(x, y, w, h);
            ctx.fillRect(x, y, w, h);
        });
    }, [items]);

    return (
        <div className={cn(
            "relative group rounded-[2.5rem] overflow-hidden bg-white border border-stone-100 shadow-massive transition-all duration-700 hover:shadow-2xl",
            className
        )}>
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[initial]" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

            {/* Scanning Line Animation */}
            <motion.div
                className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-teal-start/40 to-transparent z-20"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Header Overlay */}
            <div className="absolute top-6 left-6 right-6 z-30 flex justify-between items-start pointer-events-none">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                        <Fingerprint className="w-5 h-5 text-primary-teal-start" />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black text-black uppercase tracking-[0.2em] font-headline">{title}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Zap className="w-3 h-3 text-primary-teal-start animate-pulse" />
                            <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Quantum Engine: Locked</span>
                        </div>
                    </div>
                </div>
                <Badge variant="outline" className="bg-white/80 backdrop-blur-md border-stone-100 text-[8px] font-black py-1 px-3 shadow-sm">
                    {items.length} FORENSIC_MODES_ACTIVE
                </Badge>
            </div>

            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="Document Source"
                        fill
                        className="object-cover opacity-40 grayscale contrast-125"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-stone-50/50">
                        <div className="w-12 h-12 border border-stone-200 rounded-full flex items-center justify-center animate-spin-slow">
                            <Search className="w-5 h-5 text-stone-300" />
                        </div>
                        <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.3em]">Integrity_Probe_Active</span>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    width={800}
                    height={1000}
                />

                {/* Interactive Points */}
                {items.map((item, i) => {
                    const [ymin, xmin] = item.bbox;
                    return (
                        <div
                            key={i}
                            className="absolute w-4 h-4 -ml-2 -mt-2 z-20 cursor-help"
                            style={{ top: `${ymin}%`, left: `${xmin}%` }}
                            onMouseEnter={() => setHoverItem(item)}
                            onMouseLeave={() => setHoverItem(null)}
                        >
                            <div className={cn(
                                "w-full h-full rounded-full border-2 animate-ping opacity-75",
                                item.confidence === 'high' ? 'bg-emerald-400 border-emerald-400' :
                                    item.confidence === 'medium' ? 'bg-amber-400 border-amber-400' : 'bg-rose-400 border-rose-400'
                            )} />
                        </div>
                    );
                })}

                {/* Tooltip AnimatePresence */}
                <AnimatePresence>
                    {hoverItem && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-64 p-4 bg-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl pointer-events-none"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                {hoverItem.confidence === 'high' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> :
                                    hoverItem.confidence === 'medium' ? <Zap className="w-4 h-4 text-amber-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                                <span className="text-[10px] font-black text-white uppercase tracking-wider">{hoverItem.label}</span>
                            </div>
                            <p className="text-[9px] text-stone-400 font-bold leading-relaxed">
                                {hoverItem.description || "Forensic extraction verified against source matrix. No anomalies detected."}
                            </p>
                            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-white/40 uppercase tracking-widest">
                                <span>Agent: {hoverItem.agentId || "Omni_v4"}</span>
                                <span>{(hoverItem.confidence === 'high' ? 99 : hoverItem.confidence === 'medium' ? 85 : 45)}% MATCH</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Legend */}
            <div className="p-6 bg-stone-50/50 flex justify-between items-center relative z-30">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[9px] font-black text-stone-500 uppercase">Optimal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                        <span className="text-[9px] font-black text-stone-500 uppercase">Attention</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-[9px] font-black text-stone-500 uppercase">Review_Required</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                    <Shield className="w-3 h-3 text-stone-400" />
                    <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest leading-none">Matrix Seal Applied</span>
                </div>
            </div>
        </div>
    );
};
