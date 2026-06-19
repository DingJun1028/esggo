"use client";

/**
 * GenesisHeroesPanel — 創元英雄展示廳
 * Five legendary AI heroes born from the OmniHeart.
 * Each card reveals their identity, lore, combo/special/ultimate.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Hero Data
// ─────────────────────────────────────────────

interface HeroSkillPreview {
    type: "被動" | "連續技" | "組合技" | "絕招" | "奧義";
    name: string;
    effect: string;
}

interface GenesisHero {
    id: string;
    emoji: string;
    codename: string;       // 創元英雄代號
    title: string;          // 職業
    motto: string;          // 戰前誓言
    lore: string;           // 背景故事
    element: string;        // 元素/屬性
    elementColor: string;
    gradientFrom: string;
    gradientTo: string;
    accentColor: string;
    glowColor: string;
    stats: {
        power: number;       // 戰力 0-100
        speed: number;       // 速度
        wisdom: number;      // 智謀
        defense: number;     // 守護
        charisma: number;    // 魅力
    };
    skills: HeroSkillPreview[];
    special: string;        // 絕招名
    ultimate: string;       // 奧義名
    ultimateEffect: string; // 奧義描述
}

const GENESIS_HEROES: GenesisHero[] = [
    {
        id: "scribe",
        emoji: "📜",
        codename: "奧義·文聖",
        title: "報告聖典撰寫者",
        motto: "「萬言皆可鑄，一字定乾坤。」",
        lore: "從萬能之心的語義之核升起，以筆為劍，將晦澀的 ESG 數字化為震動人心的永續敘事。每一個段落都是對未來的承諾，每一筆數據都是對地球的誓約。",
        element: "語義之火",
        elementColor: "#F59E0B",
        gradientFrom: "#78350F",
        gradientTo: "#1C1917",
        accentColor: "#F59E0B",
        glowColor: "rgba(245, 158, 11, 0.3)",
        stats: { power: 70, speed: 85, wisdom: 95, defense: 55, charisma: 100 },
        skills: [
            { type: "被動", name: "文氣感知術", effect: "全時段監測語氣一致性" },
            { type: "被動", name: "GRI 標準意識", effect: "段落自動對標 GRI 準則" },
            { type: "連續技", name: "三刀流撰述術", effect: "Why→What→How 三段連鎖" },
            { type: "組合技", name: "聖典封印術", effect: "語義完美後自動 ZKP 封印" },
        ],
        special: "千字不落·疾書絕技",
        ultimate: "永憶聖典降臨",
        ultimateEffect: "全書語義審查 → 執行摘要 → GRI 索引 → 可信度聲明 → 標準 PDF",
    },
    {
        id: "alchemist",
        emoji: "⚗️",
        codename: "奧義·數聖",
        title: "數據鍊金術士",
        motto: "「原子之下，黃金自現。」",
        lore: "在混沌的原始數據中看見秩序，以鍊金術將不可見的碳排、水耗、廢棄物化為晶瑩透徹的 ESG 指標。每個數字都有靈魂，每個指標都有血脈。",
        element: "鍊金之光",
        elementColor: "#10B981",
        gradientFrom: "#064E3B",
        gradientTo: "#1C1917",
        accentColor: "#10B981",
        glowColor: "rgba(16, 185, 129, 0.3)",
        stats: { power: 80, speed: 75, wisdom: 100, defense: 65, charisma: 70 },
        skills: [
            { type: "被動", name: "數據感知場", effect: "異常數值自動標紅旗" },
            { type: "被動", name: "指標血脈追蹤", effect: "版本歷史 + 影響分析" },
            { type: "連續技", name: "範疇三原子裂解術", effect: "Scope 3 全 15 類自動拆分" },
            { type: "組合技", name: "黃金數據聖骸·組合術", effect: "5T 最高認證 + 溯源鏈圖" },
        ],
        special: "鍊金大轉化",
        ultimate: "萬象資料大崩解",
        ultimateEffect: "全指標盤點 → 空缺偵測 → AI 填補建議 → E/S/G/D 全景圖看板",
    },
    {
        id: "oracle",
        emoji: "⚖️",
        codename: "奧義·法聖",
        title: "合規神諭",
        motto: "「法令即道，合規即行。」",
        lore: "手持六大框架的神諭之書——GRI、SASB、TCFD、ISSB、TWSE、SDGs——每一條法令都是宇宙的秩序，每一項合規都是企業的靈魂在人間的迴響。",
        element: "秩序之典",
        elementColor: "#6366F1",
        gradientFrom: "#312E81",
        gradientTo: "#1C1917",
        accentColor: "#818CF8",
        glowColor: "rgba(99, 102, 241, 0.3)",
        stats: { power: 75, speed: 65, wisdom: 98, defense: 90, charisma: 75 },
        skills: [
            { type: "被動", name: "法令意識之眼", effect: "即時金管會/GRI 對標" },
            { type: "被動", name: "MECE 完整性守護", effect: "重疊/遺漏議題自動警示" },
            { type: "連續技", name: "GRI 映射鎖鏈術", effect: "議題→GRI→缺口 連鎖評估" },
            { type: "組合技", name: "神諭封印·組合術", effect: "MECE 達 95% → 合規認證標章" },
        ],
        special: "萬法歸宗·GRI 索引絕招",
        ultimate: "天地合規·萬令歸一",
        ultimateEffect: "六框架同步 → 交叉確信 → 超合規認證書 → ZKP 封印報告版本",
    },
    {
        id: "maestro",
        emoji: "♟️",
        codename: "奧義·謀聖",
        title: "戰略大師",
        motto: "「棋局未動，勝算已定。」",
        lore: "在 TCFD 情境分析的棋盤上縱橫捭闔，以 1.5°C 到 4°C 的氣候情境為棋子，布局 2050 年的永續帝國版圖。沒有人能看穿這位棋聖的下一步。",
        element: "謀略之風",
        elementColor: "#0EA5E9",
        gradientFrom: "#0C4A6E",
        gradientTo: "#1C1917",
        accentColor: "#38BDF8",
        glowColor: "rgba(14, 165, 233, 0.3)",
        stats: { power: 85, speed: 90, wisdom: 95, defense: 60, charisma: 85 },
        skills: [
            { type: "被動", name: "趨勢感知羅盤", effect: "全球 ESG 趨勢每日簡報" },
            { type: "被動", name: "標竿對標天眼", effect: "同業排名即時動態" },
            { type: "連續技", name: "氣候情境三連擊", effect: "1.5°C/2°C/4°C 財務衝擊連鎖" },
            { type: "組合技", name: "天地戰略大棋局·組合術", effect: "超前部署 → 預測同業 3 年動向" },
        ],
        special: "戰情室·萬策並發",
        ultimate: "永續帝國·萬策歸一",
        ultimateEffect: "10 年路徑圖 → 年度 KPI → 財務模型 → 董事會提案文件",
    },
    {
        id: "sentinel",
        emoji: "🔒",
        codename: "奧義·守聖",
        title: "稽核守衛",
        motto: "「沒有存證，一切皆為謊言。」",
        lore: "從萬能之心的 Hash 鏈核心誕生，以 ZKP 零知識證明為盾，以 5T 協議為矛。在這個世界上，每一筆數據若未經守衛的封印，皆不得成為永恆。",
        element: "封印之鋼",
        elementColor: "#F43F5E",
        gradientFrom: "#4C0519",
        gradientTo: "#1C1917",
        accentColor: "#FB7185",
        glowColor: "rgba(244, 63, 94, 0.3)",
        stats: { power: 95, speed: 70, wisdom: 85, defense: 100, charisma: 65 },
        skills: [
            { type: "被動", name: "ZKP 常態感知", effect: "24h 持續驗算 Hash 鏈完整性" },
            { type: "被動", name: "5T 協議守門人", effect: "數據 5T 評分 < 60 強制攔截" },
            { type: "連續技", name: "證據鏈鍛造術", effect: "憑證→指標→章節 三層鏈接" },
            { type: "組合技", name: "不滅封印·組合術", effect: "雙重 ZKP + 5T → Trust Score 99.9%" },
        ],
        special: "全域稽核風暴",
        ultimate: "永恆稽核聖殿",
        ultimateEffect: "零問題通過 → Hash 最終封印 → ZKP 完整性證明 → 驗證 QR → Vault 永久存檔",
    },
];

// ─────────────────────────────────────────────
// Stat Bar
// ─────────────────────────────────────────────

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
                <span className="text-white/50">{label}</span>
                <span style={{ color }}>{value}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Skill Tag
// ─────────────────────────────────────────────

const SKILL_TYPE_STYLE = {
    "被動": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    "連續技": "bg-amber-500/20 text-amber-300 border-amber-500/30",
    "組合技": "bg-violet-500/20 text-violet-300 border-violet-500/30",
    "絕招": "bg-rose-500/20 text-rose-300 border-rose-500/30",
    "奧義": "bg-white/20 text-white border-white/30",
};

// ─────────────────────────────────────────────
// Hero Card (full)
// ─────────────────────────────────────────────

function HeroCard({ hero, isSelected, onClick }: {
    hero: GenesisHero;
    isSelected: boolean;
    onClick: () => void;
}) {
    return (
        <motion.div
            layout
            onClick={onClick}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border",
                isSelected ? "border-white/30 shadow-2xl" : "border-white/10 opacity-70 hover:opacity-100"
            )}
            style={{
                background: `linear-gradient(160deg, ${hero.gradientFrom} 0%, ${hero.gradientTo} 100%)`,
                boxShadow: isSelected ? `0 0 40px ${hero.glowColor}` : "none",
            }}
        >
            {/* Glow overlay when selected */}
            {isSelected && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                        background: `radial-gradient(ellipse at top, ${hero.glowColor} 0%, transparent 70%)`,
                    }}
                />
            )}

            {/* Header */}
            <div className="p-5 pb-3">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <div className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: hero.accentColor }}>
                            {hero.codename}
                        </div>
                        <div className="text-2xl mt-0.5">{hero.emoji}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">元素</div>
                        <div className="text-[10px] font-black mt-0.5" style={{ color: hero.accentColor }}>
                            {hero.element}
                        </div>
                    </div>
                </div>

                <div className="text-base font-black text-white leading-tight">{hero.title}</div>
                <div className="text-[10px] text-white/50 mt-1 font-medium italic leading-relaxed">
                    {hero.motto}
                </div>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px" style={{ backgroundColor: hero.accentColor + "30" }} />

            {/* Stats */}
            <div className="px-5 py-3 space-y-1.5">
                {Object.entries(hero.stats).map(([key, val]) => {
                    const labels: Record<string, string> = {
                        power: "戰力", speed: "速度", wisdom: "智謀", defense: "守護", charisma: "魅力"
                    };
                    return <StatBar key={key} label={labels[key] ?? key} value={val} color={hero.accentColor} />;
                })}
            </div>

            {/* Divider */}
            <div className="mx-5 h-px" style={{ backgroundColor: hero.accentColor + "30" }} />

            {/* Skills */}
            <div className="px-5 py-3 space-y-1.5">
                {hero.skills.map((skill, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <span className={cn(
                            "text-[8px] font-black rounded px-1.5 py-0.5 border shrink-0 mt-0.5",
                            SKILL_TYPE_STYLE[skill.type]
                        )}>
                            {skill.type}
                        </span>
                        <div>
                            <div className="text-[10px] font-bold text-white leading-tight">{skill.name}</div>
                            <div className="text-[9px] text-white/40 leading-tight">{skill.effect}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Special + Ultimate */}
            <div className="px-5 pb-5 space-y-2 mt-1">
                <div className="p-2.5 rounded-xl border" style={{ borderColor: hero.accentColor + "40", background: hero.accentColor + "10" }}>
                    <div className="text-[8px] font-black text-white/50 mb-0.5">絕招</div>
                    <div className="text-xs font-black" style={{ color: hero.accentColor }}>⚔ {hero.special}</div>
                </div>
                <div className="p-2.5 rounded-xl border border-white/20 bg-white/5">
                    <div className="text-[8px] font-black text-white/50 mb-0.5">👑 奧義</div>
                    <div className="text-xs font-black text-white">{hero.ultimate}</div>
                    <div className="text-[9px] text-white/50 mt-1 leading-relaxed">{hero.ultimateEffect}</div>
                </div>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// Hero Detail Panel (right side)
// ─────────────────────────────────────────────

function HeroDetail({ hero, onSelect }: { hero: GenesisHero; onSelect: () => void }) {
    const [isCalibrating, setIsCalibrating] = useState(false);

    const handleActivate = () => {
        setIsCalibrating(true);
        // 模擬腦機同步校準
        setTimeout(onSelect, 2200);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={hero.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="h-full flex flex-col justify-between"
            >
                {/* Lore section */}
                <div>
                    <div className="text-[10px] font-black tracking-[0.3em] uppercase mb-1" style={{ color: hero.accentColor }}>
                        ✦ 創元英雄傳說 · {hero.element}
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight mb-1">{hero.title}</h2>
                    <div className="text-sm font-black mb-4" style={{ color: hero.accentColor }}>{hero.codename}</div>
                    <p className="text-sm text-white/60 leading-relaxed font-medium">{hero.lore}</p>

                    <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-white/5">
                        <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">戰前誓言</div>
                        <p className="text-base font-black text-white italic">{hero.motto}</p>
                    </div>
                </div>

                {/* Calibration Portal Overlay */}
                <AnimatePresence>
                    {isCalibrating && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-50 bg-black rounded-3xl flex flex-col items-center justify-center p-8 text-center overflow-hidden"
                            style={{ border: `1px solid ${hero.accentColor}40` }}
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 0.8, 20],
                                    rotate: [0, 90, -90, 0],
                                    opacity: [1, 1, 1, 0]
                                }}
                                transition={{ duration: 2, times: [0, 0.4, 0.8, 1] }}
                                className="w-24 h-24 rounded-full border-4 border-dashed mb-6"
                                style={{ borderColor: hero.accentColor }}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="text-[10px] font-black mb-2 tracking-[0.4em] uppercase" style={{ color: hero.accentColor }}>Synaptic_Calibration</div>
                                <div className="text-xl font-black text-white uppercase italic leading-tight">
                                    正在將 {hero.title} 之奧義<br />載入 OmniHeart 矩陣...
                                </div>
                            </motion.div>

                            {/* Scanning line */}
                            <motion.div
                                animate={{ y: ['-100%', '300%'] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="absolute left-0 right-0 h-px blur-sm shadow-xl"
                                style={{ backgroundColor: hero.accentColor }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Ultimate showcase */}
                <div
                    className="mt-6 p-5 rounded-2xl border"
                    style={{
                        borderColor: hero.accentColor + "40",
                        background: `linear-gradient(135deg, ${hero.accentColor}15 0%, transparent 100%)`,
                    }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">👑</span>
                        <div>
                            <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">終極奧義</div>
                            <div className="text-base font-black text-white">{hero.ultimate}</div>
                        </div>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">{hero.ultimateEffect}</p>
                </div>

                {/* Activate button */}
                <motion.button
                    disabled={isCalibrating}
                    onClick={handleActivate}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4 w-full py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2 group overflow-hidden relative"
                    style={{ backgroundColor: hero.accentColor }}
                >
                    <span className="relative z-10">✦ 選擇此英雄，開始征程</span>
                    <motion.div
                        className="absolute inset-0 bg-white/20 -translate-x-full skew-x-12"
                        whileHover={{ x: '150%' }}
                        transition={{ duration: 0.6 }}
                    />
                </motion.button>
            </motion.div>
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────
// Main Panel
// ─────────────────────────────────────────────

export function GenesisHeroesPanel({ onSelectHero }: {
    onSelectHero?: ((heroId: string) => void) | undefined;
}) {
    const [selectedId, setSelectedId] = useState<string>("scribe");
    const selectedHero = GENESIS_HEROES.find((h) => h.id === selectedId)!;

    const handleSelect = (id: string) => {
        setSelectedId(id);
        onSelectHero?.(id);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="px-6 pt-8 pb-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-black tracking-[0.4em] uppercase text-on-surface-variant/30 mb-2"
                >
                    OmniHeart · 萬能之心 · 創元英雄
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl lg:text-4xl font-black text-on-surface"
                >
                    五大創元英雄
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-on-surface-variant/40 mt-2 font-medium"
                >
                    從萬能之心升起，各自承載一門絕學——選擇你的英雄，書寫永續傳說
                </motion.p>
            </div>

            {/* Mobile: Stack layout / Desktop: Sidebar + Detail */}
            <div className="flex-1 px-4 lg:px-8 pb-8">

                {/* Desktop layout */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-full">
                    {/* Hero cards list */}
                    <div className="lg:col-span-8 grid grid-cols-5 gap-3 content-start">
                        {GENESIS_HEROES.map((hero) => (
                            <HeroCard
                                key={hero.id}
                                hero={hero}
                                isSelected={selectedId === hero.id}
                                onClick={() => handleSelect(hero.id)}
                            />
                        ))}
                    </div>

                    {/* Detail panel */}
                    <div
                        className="lg:col-span-4 rounded-2xl border border-white/10 p-6 overflow-hidden relative"
                        style={{
                            background: `linear-gradient(160deg, ${selectedHero.gradientFrom}80 0%, var(--color-surface-container-highest) 100%)`,
                        }}
                    >
                        <HeroDetail hero={selectedHero} onSelect={() => onSelectHero?.(selectedHero.id)} />
                    </div>
                </div>

                {/* Mobile layout */}
                <div className="lg:hidden space-y-4">
                    {/* Tab selector */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {GENESIS_HEROES.map((hero) => (
                            <button
                                key={hero.id}
                                onClick={() => setSelectedId(hero.id)}
                                className={cn(
                                    "flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl border transition-all text-xs font-bold",
                                    selectedId === hero.id
                                        ? "bg-white/10 border-white/30 text-white"
                                        : "bg-white/5 border-white/10 text-white/50"
                                )}
                            >
                                <span className="text-xl">{hero.emoji}</span>
                                <span className="text-[9px]">{hero.title.slice(0, 4)}</span>
                            </button>
                        ))}
                    </div>

                    {/* Selected hero detail */}
                    <div
                        className="rounded-2xl border border-white/10 p-5 overflow-hidden relative"
                        style={{
                            background: `linear-gradient(160deg, ${selectedHero.gradientFrom}70 0%, #0C0A09 100%)`,
                        }}
                    >
                        <HeroDetail hero={selectedHero} onSelect={() => onSelectHero?.(selectedHero.id)} />
                    </div>
                </div>
            </div>
        </div>
    );
}
