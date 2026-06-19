"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, FileSearch, Link as LinkIcon, AlertTriangle, FileText, CheckCircle2, ChevronRight, Hash } from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Decimal = require('decimal.js').default || require('decimal.js');

// --- Types ---
interface BoundingBox {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    value: string | number;
    label: string;
}

interface DigitalField {
    id: string;
    label: string;
    value: string | number;
    unit: string;
    confidence: number;
    sourceBoxId: string;
    formula?: string;
}

// --- Mock Data ---
const MOCK_DOCUMENT_BOXES: BoundingBox[] = [
    { id: "box-kwh", x: 60, y: 35, width: 25, height: 8, value: 12500, label: "Total kWh" },
    { id: "box-cost", x: 60, y: 45, width: 20, height: 8, value: 37500, label: "Total Amount" },
    { id: "box-period", x: 60, y: 25, width: 30, height: 6, value: "2026/01", label: "Billing Period" },
    { id: "box-meter", x: 15, y: 25, width: 25, height: 6, value: "0A-9876543", label: "Meter ID" }
];

const MOCK_DIGITAL_FIELDS: DigitalField[] = [
    { id: "f-period", label: "Billing Period", value: "2026/01", unit: "", confidence: 100, sourceBoxId: "box-period" },
    { id: "f-meter", label: "Meter ID", value: "0A-9876543", unit: "", confidence: 100, sourceBoxId: "box-meter" },
    { id: "f-kwh", label: "Electricity Consumed", value: 12500, unit: "kWh", confidence: 92, sourceBoxId: "box-kwh" },
    { id: "f-cost", label: "Total Cost", value: 37500, unit: "TWD", confidence: 85, sourceBoxId: "box-cost" },
    { id: "f-emission", label: "Scope 2 Emission (Calculated)", value: new Decimal(12500).times(0.495).toNumber(), unit: "kgCO2e", confidence: 99, sourceBoxId: "box-kwh", formula: "12500 kWh × 0.495 (2025 MOEA Factor)" }
];

export default function EvidenceDrawerPage() {
    const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
    const [lineCoords, setLineCoords] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);

    const leftPaneRef = useRef<HTMLDivElement>(null);
    const rightPaneRef = useRef<HTMLDivElement>(null);
    const boxRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Calculate line coordinates when activeFieldId changes
    useEffect(() => {
        if (activeFieldId && leftPaneRef.current && rightPaneRef.current) {
            const field = MOCK_DIGITAL_FIELDS.find(f => f.id === activeFieldId);
            if (field) {
                const boxEl = boxRefs.current[field.sourceBoxId];
                const fieldEl = fieldRefs.current[activeFieldId];

                if (boxEl && fieldEl) {
                    const boxRect = boxEl.getBoundingClientRect();
                    const fieldRect = fieldEl.getBoundingClientRect();

                    // We need coordinates relative to the viewport for the fixed SVG overlay
                    setLineCoords({
                        x1: boxRect.right - 10, // slightly inside the box
                        y1: boxRect.top + boxRect.height / 2,
                        x2: fieldRect.left + 10, // slightly inside the field
                        y2: fieldRect.top + fieldRect.height / 2
                    });
                    return;
                }
            }
        }
        setLineCoords(null);
    }, [activeFieldId]);

    // Handle window resize to recalculate line
    useEffect(() => {
        const handleResize = () => {
            if (activeFieldId) {
                // Trigger re-render to recalculate coordinates
                setActiveFieldId(prev => prev);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeFieldId]);


    return (
        <div className="min-h-screen bg-[#02080a] text-white p-6 pb-32">

            {/* Header */}
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-light text-[#63a6b0] flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8" />
                        The Golden Thread View <span className="text-sm border border-[#63a6b0]/30 px-2 py-1 rounded bg-[#63a6b0]/10 ml-2">Phase 22: Project Genesis</span>
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm tracking-wide">
                        Immutable Evidence Traceability & Source Protocol Verification
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-700/50 p-3 rounded-xl backdrop-blur-md">
                    <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Document Hash</p>
                        <p className="text-sm font-mono text-emerald-400 flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            9b71d2...cae
                        </p>
                    </div>
                    <div className="h-8 w-px bg-slate-700/50"></div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Status</p>
                        <p className="text-sm text-[#63a6b0] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Sealed (Truth)
                        </p>
                    </div>
                </div>
            </header>

            {/* Split Pane View */}
            <div className="flex flex-col lg:flex-row gap-6 relative" style={{ minHeight: '600px' }}>

                {/* SVG Overlay for the Golden Thread */}
                <svg className="pointer-events-none fixed inset-0 w-full h-full z-50">
                    <AnimatePresence>
                        {lineCoords && (
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                d={`M ${lineCoords.x1} ${lineCoords.y1} C ${lineCoords.x1 + 150} ${lineCoords.y1}, ${lineCoords.x2 - 150} ${lineCoords.y2}, ${lineCoords.x2} ${lineCoords.y2}`}
                                fill="none"
                                stroke="url(#golden-gradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                filter="drop-shadow(0 0 8px rgba(250,204,21,0.6))"
                            />
                        )}
                    </AnimatePresence>
                    <defs>
                        <linearGradient id="golden-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#fde047" />
                            <stop offset="50%" stopColor="#eab308" />
                            <stop offset="100%" stopColor="#fef08a" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Left Pane: Source Origin */}
                <div ref={leftPaneRef} className="flex-1 rounded-2xl border border-slate-800 bg-[#0a1114]/80 backdrop-blur-xl overflow-hidden relative group">
                    <div className="p-4 border-b border-slate-800 bg-black/40 flex items-center justify-between">
                        <h2 className="text-[#63a6b0] text-sm font-semibold tracking-widest flex items-center gap-2">
                            <FileSearch className="w-4 h-4" />
                            SOURCE ORIGIN (VOUCHER)
                        </h2>
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">Taiwan Power Co. Invoice_202601.pdf</span>
                    </div>

                    {/* Mock Document Area */}
                    <div className="p-8 relative h-full min-h-[500px] flex items-center justify-center bg-slate-900/20">
                        {/* Fake Document Paper */}
                        <div className="w-[80%] h-[90%] bg-slate-100 rounded shadow-2xl relative p-6 text-slate-800 font-serif">
                            {/* Document Content Mockup */}
                            <div className="border-b-2 border-slate-300 pb-4 mb-4 flex justify-between items-end">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-700">TAIWAN POWER COMPANY</h3>
                                    <p className="text-sm text-slate-500">Electricity Bill Payment Notice</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-mono text-slate-500">Invoice No: TP-2026-0019284</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-12">
                                    <div>
                                        <p className="text-xs text-slate-400">Customer ID</p>
                                        <p className="font-mono">88-99-1234</p>
                                    </div>
                                </div>
                            </div>

                            {/* Render Bounding Boxes */}
                            {MOCK_DOCUMENT_BOXES.map(box => {
                                const isTarget = activeFieldId ? MOCK_DIGITAL_FIELDS.find(f => f.id === activeFieldId)?.sourceBoxId === box.id : false;
                                return (
                                    <div
                                        key={box.id}
                                        ref={(el) => { boxRefs.current[box.id] = el; }}
                                        className={`absolute border-2 transition-all duration-300 rounded ${isTarget ? 'border-yellow-400 bg-yellow-400/20 z-10 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-[#63a6b0]/40 bg-[#63a6b0]/10 hover:border-[#63a6b0] cursor-pointer'}`}
                                        style={{
                                            left: `${box.x}%`,
                                            top: `${box.y}%`,
                                            width: `${box.width}%`,
                                            height: `${box.height}%`
                                        }}
                                    >
                                        {/* Tooltip for box */}
                                        <div className={`absolute -top-6 left-0 whitespace-nowrap bg-slate-900 text-xs text-white px-2 py-0.5 rounded transition-opacity duration-200 ${isTarget ? 'opacity-100' : 'opacity-0'}`}>
                                            OCR Extracted: {box.value}
                                        </div>
                                        {/* Faux text inside box for visual context */}
                                        <div className="w-full h-full flex items-center px-2">
                                            <span className={`font-mono text-sm ${isTarget ? 'text-black font-bold' : 'text-slate-600'}`}>{box.value}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Pane: Digital Truth */}
                <div ref={rightPaneRef} className="flex-1 rounded-2xl border border-slate-800 bg-[#0a1114]/80 backdrop-blur-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-800 bg-black/40 flex items-center justify-between">
                        <h2 className="text-[#63a6b0] text-sm font-semibold tracking-widest flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            DIGITAL TRUTH (IComponentCore)
                        </h2>
                        <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-800">Immutable</span>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto space-y-4">
                        <div className="mb-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Hover over any digital field below to trace it back to its <span className="text-yellow-400">Source Origin</span> via the Golden Thread. This fulfills the <strong>Traceable</strong> and <strong>Transparent</strong> requirements of the 5T Protocol.
                            </p>
                        </div>

                        {MOCK_DIGITAL_FIELDS.map(field => {
                            const isActive = activeFieldId === field.id;

                            // Determine confidence color
                            let confColor = "text-emerald-400";
                            let confBg = "bg-emerald-400/10";
                            let icon = <CheckCircle2 className="w-4 h-4" />;
                            if (field.confidence < 90 && field.confidence >= 70) {
                                confColor = "text-yellow-400";
                                confBg = "bg-yellow-400/10";
                                icon = <AlertTriangle className="w-4 h-4" />;
                            } else if (field.confidence < 70) {
                                confColor = "text-red-400";
                                confBg = "bg-red-400/10";
                                icon = <AlertTriangle className="w-4 h-4" />;
                            }

                            return (
                                <div
                                    key={field.id}
                                    ref={(el) => { fieldRefs.current[field.id] = el; }}
                                    onMouseEnter={() => setActiveFieldId(field.id)}
                                    onMouseLeave={() => setActiveFieldId(null)}
                                    className={`relative p-4 rounded-xl border transition-all duration-300 cursor-default
                                        ${isActive
                                            ? 'bg-slate-800 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.1)] translate-x-2'
                                            : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800 hover:border-[#63a6b0]/50'
                                        }
                                    `}
                                >
                                    {isActive && (
                                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                                    )}

                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{field.label}</div>
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs ${confColor} ${confBg} border border-current`}>
                                            {icon}
                                            {field.confidence}% Confidence
                                        </div>
                                    </div>

                                    <div className="flex items-baseline gap-2">
                                        <div className={`text-2xl font-mono ${isActive ? 'text-yellow-400 font-bold' : 'text-white'}`}>
                                            {typeof field.value === 'number' ? field.value.toLocaleString() : field.value}
                                        </div>
                                        <div className="text-sm text-[#63a6b0]">{field.unit}</div>
                                    </div>

                                    {field.formula && (
                                        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-start gap-2">
                                            <div className="bg-[#63a6b0]/20 p-1 rounded text-[#63a6b0]">
                                                <LinkIcon className="w-3 h-3" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 mb-0.5">Transparent Formula (Zero Hallucination)</div>
                                                <div className="text-sm font-mono text-slate-300 bg-black/30 px-2 py-1 rounded inline-block">
                                                    {field.formula}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!field.formula && isActive && (
                                        <div className="mt-3 text-xs text-yellow-400/80 flex items-center gap-1">
                                            <ChevronRight className="w-3 h-3" />
                                            Tracing source coordinate Origin: {field.sourceBoxId}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
