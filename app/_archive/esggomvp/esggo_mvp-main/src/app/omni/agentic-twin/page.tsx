'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { OmniTable } from "@/components/omni/liquid-glass/OmniTable";
import { OMNI_MODULES } from "@/config/omni-modules";
import { Brain, SlidersHorizontal, ShieldAlert, Zap, Cpu } from "lucide-react";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { motion, AnimatePresence } from "framer-motion";

// Import new Agentic Twin components
import { TwinCard } from "@/components/agentic-twin/TwinCard";
import { TwinChat } from "@/components/agentic-twin/TwinChat";
import { DecisionPanel } from "@/components/agentic-twin/DecisionPanel";

/**
 * 🧠 Agentic Twin Decision-AI (決策模擬實驗室)
 * Phase B: 互動式 What-If ESG 策略模擬器 & Agentic Twin 整合
 */
export default function AgenticTwinPage() {
    const moduleInfo = OMNI_MODULES.AGENTIC_TWIN;

    // 模擬參數狀態
    const [greenEnergyPct, setGreenEnergyPct] = useState(40);
    const [rAndDInvestment, setRAndDInvestment] = useState(15);
    const [supplyChainTransparency, setSupplyChainTransparency] = useState(60);

    // Agentic Twin 狀態
    const [twins, setTwins] = useState<any[]>([]);
    const [activeTwinId, setActiveTwinId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string, timestamp: number }[]>([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [decisions, setDecisions] = useState<any[]>([]);
    const [validations, setValidations] = useState<any[]>([]);

    // 載入可用的 Twins
    useEffect(() => {
        const fetchTwins = async () => {
            try {
                const res = await fetch('/api/agentic-twin/twins');
                const data = await res.json();
                if (data.success && data.data) {
                    setTwins(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch twins", err);
            }
        };
        fetchTwins();
    }, []);

    // 根據滑桿動態計算的預估 ESG 防禦力分數 (Mock Logic)
    const projectedScore = useMemo(() => {
        const base = 50;
        const energyBonus = (greenEnergyPct / 100) * 20;
        const rndBonus = (rAndDInvestment / 50) * 15;
        const scBonus = (supplyChainTransparency / 100) * 15;
        return Math.min(100, Math.round(base + energyBonus + rndBonus + scBonus));
    }, [greenEnergyPct, rAndDInvestment, supplyChainTransparency]);

    const activeTwin = twins.find(t => t.uuid === activeTwinId);

    const handleSendMessage = async (message: string) => {
        if (!activeTwinId) return;

        const newMsg = { role: 'user' as const, content: message, timestamp: Date.now() };
        setChatMessages(prev => [...prev, newMsg]);
        setIsChatLoading(true);

        try {
            const context = {
                message,
                currentStats: { greenEnergyPct, rAndDInvestment, supplyChainTransparency, projectedScore }
            };

            const res = await fetch('/api/agentic-twin/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ twinUuid: activeTwinId, context })
            });
            const data = await res.json();

            if (data.success) {
                const decision = data.data;
                const validation = data.validation;

                setChatMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `${decision.recommendation}\n\n[Confidence: ${(decision.confidence * 100).toFixed(1)}% | Risk: ${decision.riskAssessment?.level || 'UNKNOWN'}]`,
                    timestamp: Date.now()
                }]);

                setDecisions(prev => [decision, ...prev].slice(0, 10)); // Keep last 10
                if (validation) {
                    setValidations(prev => [validation, ...prev].slice(0, 10));
                }
            } else {
                setChatMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `Error: ${data.error || 'Failed to generate decision'}`,
                    timestamp: Date.now()
                }]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsChatLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 relative">

            {/* Background 4D Core */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none -z-10 opacity-20 mix-blend-screen">
                <motion.div
                    animate={{ rotateZ: -360, scale: [1, 1.05, 1] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full rounded-full bg-gradient-to-br from-rose-500/40 via-purple-500/10 to-transparent blur-[100px]"
                />
            </div>

            <div className="flex flex-col gap-2 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-black tracking-[0.3em] uppercase text-rose-400 w-fit shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                    <Brain size={10} className="animate-pulse" />
                    {moduleInfo.domain} Adv · {moduleInfo.uuid}
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic text-omni-text-main uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Agentic <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">Twin</span> Simulator
                </h1>
                <p className="text-omni-text-muted text-sm font-medium max-w-2xl font-['Outfit']">
                    {moduleInfo.description} — 調控 ESG 變數，即時預演多維度的永續決策影響力 (What-If Analysis)。
                </p>
            </div>

            {/* Twin Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                {twins.length === 0 ? (
                    <div className="col-span-full py-4 text-center text-white/50 animate-pulse">
                        Waking up twins...
                    </div>
                ) : (
                    twins.map(twin => (
                        <TwinCard
                            key={twin.uuid}
                            id={twin.uuid}
                            name={twin.twinName}
                            type={twin.twinType}
                            description="Dedicated AI Twin for specialized ESG strategy and analysis."
                            isActive={activeTwinId === twin.uuid}
                            onClick={() => setActiveTwinId(twin.uuid)}
                        />
                    ))
                )}
            </div>

            {/* 🎛️ Simulator Control Panel & Score Display */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Left: Controls */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <LiquidGlassContainer glowColor="rose" intensity="medium" className="h-full">
                        <div className="p-4 flex flex-col gap-8">
                            <h3 className="text-lg font-black tracking-widest text-white uppercase flex items-center gap-2 italic">
                                <SlidersHorizontal size={20} className="text-rose-400" />
                                策略調控台 (Strategy Parameters)
                            </h3>

                            <div className="flex flex-col gap-6">
                                <StrategySlider
                                    label="綠電採用佔比 (Green Energy %)"
                                    value={greenEnergyPct}
                                    setValue={setGreenEnergyPct}
                                    max={100}
                                    icon={<Zap size={16} className="text-emerald-400" />}
                                    color="emerald"
                                />
                                <StrategySlider
                                    label="研發預算投入 (R&D M-USD)"
                                    value={rAndDInvestment}
                                    setValue={setRAndDInvestment}
                                    max={50}
                                    icon={<Cpu size={16} className="text-blue-400" />}
                                    color="blue"
                                />
                                <StrategySlider
                                    label="供應鏈透明度 (Supply Chain Transparency %)"
                                    value={supplyChainTransparency}
                                    setValue={setSupplyChainTransparency}
                                    max={100}
                                    icon={<ShieldAlert size={16} className="text-amber-400" />}
                                    color="amber"
                                />
                            </div>
                        </div>
                    </LiquidGlassContainer>
                </div>

                {/* Right: Projected Score */}
                <div className="lg:col-span-1">
                    <LiquidGlassContainer glowColor="fuchsia" intensity="high" className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/10 to-transparent"></div>
                        <h3 className="text-sm font-black tracking-[0.3em] text-omni-text-muted uppercase mb-8 z-10">預估 ESG 綜合防禦力</h3>

                        <div className="relative flex items-center justify-center w-48 h-48 z-10">
                            {/* Animated SVG Ring */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                                <circle
                                    cx="96" cy="96" r="88"
                                    className="stroke-white/5 fill-none"
                                    strokeWidth="12"
                                />
                                <motion.circle
                                    cx="96" cy="96" r="88"
                                    className="stroke-fuchsia-500 fill-none"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    initial={{ strokeDasharray: "0 1000" }}
                                    animate={{ strokeDasharray: `${(projectedScore / 100) * 553} 1000` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </svg>

                            <div className="flex flex-col items-center justify-center gap-1">
                                <AnimatePresence mode="popLayout">
                                    <motion.span
                                        key={projectedScore}
                                        initial={{ opacity: 0, scale: 0.5, y: -20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tighter font-['Outfit']"
                                    >
                                        {projectedScore}
                                    </motion.span>
                                </AnimatePresence>
                                <span className="text-xs font-bold text-fuchsia-400 tracking-widest uppercase">/ 100 Pts</span>
                            </div>
                        </div>
                    </LiquidGlassContainer>
                </div>
            </div>

            {/* Chat and Decisions Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                <div className="lg:col-span-1">
                    <TwinChat
                        twinId={activeTwinId}
                        twinName={activeTwin?.twinName}
                        onSendMessage={handleSendMessage}
                        messages={chatMessages}
                        isLoading={isChatLoading}
                    />
                </div>
                <div className="lg:col-span-2">
                    <DecisionPanel
                        decisions={decisions}
                        validationHistory={validations}
                    />
                </div>
            </div>

        </div>
    );
}

// 🎚️ Custom Slider Component
function StrategySlider({ label, value, setValue, max, icon, color }: any) {
    return (
        <div className="flex flex-col gap-3 group">
            <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-omni-text-main flex items-center gap-2 uppercase tracking-wide">
                    {icon} {label}
                </label>
                <span className={`text-sm font-black text-${color}-400 font-['Outfit']`}>{value}</span>
            </div>
            <div className="relative h-2 rounded-full bg-white/5 border border-white/5 overflow-hidden group-hover:border-white/20 transition-colors">
                <motion.div
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r from-${color}-600 to-${color}-400 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(value / max) * 100}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <input
                    type="range"
                    min="0"
                    max={max}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
        </div>
    );
}
