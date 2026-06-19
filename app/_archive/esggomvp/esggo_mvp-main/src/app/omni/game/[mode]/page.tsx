"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GameMode } from "@/core/omni-game-engine";
import { OmniGameCanvas } from "@/components/omni/game/OmniGameCanvas";
import { OmniCardData } from "@/components/omni/cards/OmniCard";
import { v4 as uuidv4 } from "uuid";

// Sample Starter Deck for development
const STARTER_DECK: OmniCardData[] = [
    { card_id: "CARD-TUT-001", card_name: "Gnosis Path", card_name_zh: "智學之路", card_type: "Knowledge", rarity: "Common", esg_dimension: "G", sub_category: "Tutorial", power_score: 15, description: "掌握基本治理原則。", effect_text: "智力 +5", lore_text: "「明辨是非，始於知。」", color_theme: "#3b82f6" },
    { card_id: "CARD-ACT-001", card_name: "Green Action", card_name_zh: "綠色行動", card_type: "Action", rarity: "Uncommon", esg_dimension: "E", sub_category: "Environment", power_score: 45, description: "執行減碳任務。", effect_text: "勇氣 +10", lore_text: "「行勝於言。」", color_theme: "#10b981" },
    { card_id: "CARD-S-001", card_name: "Social Bond", card_name_zh: "社會連結", card_type: "Action", rarity: "Rare", esg_dimension: "S", sub_category: "Social", power_score: 65, description: "強化社區參與。", effect_text: "仁慈 +15", lore_text: "「眾志成城。」", color_theme: "#f43f5e" },
    { card_id: "CARD-FRM-001", card_name: "GRI Framework", card_name_zh: "GRI 框架", card_type: "Framework", rarity: "Legendary", esg_dimension: "ESG", sub_category: "Standards", power_score: 90, description: "全域揭露標準。", effect_text: "全屬性 +20", lore_text: "「誠信之本。」", color_theme: "#eab308" },
    { card_id: "CARD-EVT-001", card_name: "Climate Risk", card_name_zh: "氣候風險", card_type: "Event", rarity: "Epic", esg_dimension: "E", sub_category: "Risk", power_score: 80, description: "應對突發災害。", effect_text: "挑戰韌性", lore_text: "「危中有機。」", color_theme: "#a855f7" },
];

const VALID_MODES: GameMode[] = ["Gnosis", "Social", "Resilience", "Audit", "Efficiency", "Harmony"];

// Configuration mapping for mode-specific themes
const MODE_THEMES: Record<GameMode, { bgLeft: string, bgRight: string, titleColor: string }> = {
    Gnosis: { bgLeft: "bg-blue-500/10", bgRight: "bg-cyan-500/10", titleColor: "from-blue-200 to-cyan-400" },
    Social: { bgLeft: "bg-rose-500/10", bgRight: "bg-pink-500/10", titleColor: "from-rose-200 to-pink-400" },
    Resilience: { bgLeft: "bg-orange-500/10", bgRight: "bg-red-500/10", titleColor: "from-orange-200 to-red-400" },
    Audit: { bgLeft: "bg-[#63a6b0]/10", bgRight: "bg-emerald-500/10", titleColor: "from-[#63a6b0] to-emerald-400" },
    Efficiency: { bgLeft: "bg-amber-500/10", bgRight: "bg-yellow-500/10", titleColor: "from-amber-200 to-yellow-400" },
    Harmony: { bgLeft: "bg-purple-500/10", bgRight: "bg-blue-500/10", titleColor: "from-purple-200 to-blue-400" },
};

export default function GameModePage() {
    const params = useParams();
    const router = useRouter();
    const [uuid] = useState(uuidv4());

    // Typecast and validate the mode from the URL parameter
    const modeString = params?.mode as string;
    const isValidMode = VALID_MODES.includes(modeString as GameMode);
    const mode = isValidMode ? (modeString as GameMode) : null;

    useEffect(() => {
        if (!mode) {
            router.replace("/omni/game");
        }
    }, [mode, router]);

    if (!mode) return null;

    const theme = MODE_THEMES[mode];

    return (
        <div className="min-h-screen bg-[#071520] text-white p-8 animate-in fade-in duration-700" data-omni-uuid={uuid}>
            <header className="max-w-7xl mx-auto mb-12 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-white/10 text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {mode} Trial · 善向紀元
                </div>
                <h1 className={`text-4xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r ${theme.titleColor}`}>
                    對局啟動 UUID: {uuid.split('-')[0]}
                </h1>
            </header>

            <main className="max-w-7xl mx-auto position-relative z-10">
                <OmniGameCanvas
                    mode={mode}
                    initialCards={STARTER_DECK}
                    onExit={() => router.push("/omni/game")}
                />
            </main>

            {/* Global Background Glows explicitly mapped mapping theme */}
            <div className={`fixed -top-40 -left-40 w-[600px] h-[600px] ${theme.bgLeft} rounded-full blur-[120px] pointer-events-none z-[0]`} />
            <div className={`fixed -bottom-40 -right-40 w-[600px] h-[600px] ${theme.bgRight} rounded-full blur-[120px] pointer-events-none z-[0]`} />
        </div>
    );
}
