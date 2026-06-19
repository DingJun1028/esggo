"use client";

import React, { useState, useEffect } from "react";
import { GameMode } from "@/core/omni-game-engine";
import { OmniGameModeSelector } from "@/components/omni/game/OmniGameModeSelector";
import { OmniGameCanvas } from "@/components/omni/game/OmniGameCanvas";
import { OmniCardData } from "@/components/omni/cards/OmniCard";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { Trophy, Info } from "lucide-react";

// Sample Starter Deck for development
const STARTER_DECK: OmniCardData[] = [
    { card_id: "CARD-TUT-001", card_name: "Gnosis Path", card_name_zh: "智學之路", card_type: "Knowledge", rarity: "Common", esg_dimension: "G", sub_category: "Tutorial", power_score: 15, description: "掌握基本治理原則。", effect_text: "智力 +5", lore_text: "「明辨是非，始於知。」", color_theme: "#3b82f6" },
    { card_id: "CARD-ACT-001", card_name: "Green Action", card_name_zh: "綠色行動", card_type: "Action", rarity: "Uncommon", esg_dimension: "E", sub_category: "Environment", power_score: 45, description: "執行減碳任務。", effect_text: "勇氣 +10", lore_text: "「行勝於言。」", color_theme: "#10b981" },
    { card_id: "CARD-S-001", card_name: "Social Bond", card_name_zh: "社會連結", card_type: "Action", rarity: "Rare", esg_dimension: "S", sub_category: "Social", power_score: 65, description: "強化社區參與。", effect_text: "仁慈 +15", lore_text: "「眾志成城。」", color_theme: "#f43f5e" },
    { card_id: "CARD-FRM-001", card_name: "GRI Framework", card_name_zh: "GRI 框架", card_type: "Framework", rarity: "Legendary", esg_dimension: "ESG", sub_category: "Standards", power_score: 90, description: "全域揭露標準。", effect_text: "全屬性 +20", lore_text: "「誠信之本。」", color_theme: "#eab308" },
    { card_id: "CARD-EVT-001", card_name: "Climate Risk", card_name_zh: "氣候風險", card_type: "Event", rarity: "Epic", esg_dimension: "E", sub_category: "Risk", power_score: 80, description: "應對突發災害。", effect_text: "挑戰韌性", lore_text: "「危中有機。」", color_theme: "#a855f7" },
];

export default function OmniGamePage() {
    const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const res = await fetch('/api/impact-nexus');
                const json = await res.json();
                if (json.success && json.data.length > 0) {
                    setLeaderboard(json.data.slice(0, 5));
                } else {
                    setLeaderboard([
                        { player_name: "Master_Satoshi", score: 9800 },
                        { player_name: "ESG_Guardian", score: 8500 },
                        { player_name: "Carbon_Slayer", score: 7200 },
                    ]);
                }
            } catch (error) {
                console.error("Leaderboard fetch error:", error);
            }
        }
        fetchLeaderboard();
    }, []);

    return (
        <div className="min-h-screen bg-[#071520] text-white p-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <header className="max-w-7xl mx-auto mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aqua/10 border border-aqua/30 text-aqua text-[10px] font-black uppercase tracking-widest mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-aqua animate-pulse" />
                    Impact Nexus · 善向紀元
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                    萬能卡牌 · 六德對局
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    透過「智、仁、勇、誠、節、和」六大維度，將 ESG 知識轉化為真實的影響力。
                    每一場對局皆會經由 5T 協議存於永恆宮殿。
                </p>
            </header>

            {/* Game Content */}
            <main className="max-w-7xl mx-auto">
                {!selectedMode ? (
                    <div className="space-y-12">
                        <OmniGameModeSelector onSelect={setSelectedMode} />

                        {/* Stats / Leaderboard Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
                            <LiquidGlassContainer className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Trophy className="text-gold" size={24} />
                                    <h3 className="text-xl font-bold uppercase tracking-widest">全域榮譽榜 (Leaderboard)</h3>
                                </div>
                                <div className="space-y-4">
                                    {leaderboard.map((entry, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-500 font-mono">0{i + 1}</span>
                                                <span className="font-bold">{entry.player_name}</span>
                                            </div>
                                            <span className="text-gold font-black">{entry.score.toLocaleString()} PTS</span>
                                        </div>
                                    ))}
                                </div>
                            </LiquidGlassContainer>

                            <LiquidGlassContainer className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Info className="text-aqua" size={24} />
                                    <h3 className="text-xl font-bold uppercase tracking-widest">玩法提示</h3>
                                </div>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    <li className="flex gap-3">
                                        <span className="text-aqua">▸</span>
                                        <span>選擇與模式維度匹配的卡牌（如：勇之境優先使用行動卡）可獲得額外加成。</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-aqua">▸</span>
                                        <span>能量值歸零時對局將自動結束，請謹慎管理資源。</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-aqua">▸</span>
                                        <span>最終 Manifest 的結果將永久提升您的「善向影響力指標」。</span>
                                    </li>
                                </ul>
                            </LiquidGlassContainer>
                        </div>
                    </div>
                ) : (
                    <OmniGameCanvas
                        mode={selectedMode}
                        initialCards={STARTER_DECK}
                        onExit={() => setSelectedMode(null)}
                    />
                )}
            </main>

            {/* Global Background Glows */}
            <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed -bottom-40 -right-40 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
}
