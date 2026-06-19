"use client";

import React, { useState, useMemo } from "react";
import { OmniCard, OmniMiniCard, OmniCardData, RARITY_CONFIG, DIMENSION_CONFIG, TYPE_CONFIG } from "../../../../components/omni/cards/OmniCard";
import { useCardSize, useCardColumns } from "../../../../hooks/omni/useCardSize";


/* ── 示範資料 ─────────────────────────────────────────────────── */
const DEMO_BINDER_CARDS: OmniCardData[] = [
    { card_id: "CARD-000-JUNAIKEY", card_name: "JunAiKey — The Omni Master Key", card_name_zh: "竣 IKey 萬能元鑰", card_type: "Wildcard", rarity: "Transcend", esg_dimension: "ESG", sub_category: "Origin", power_score: 100, description: "ESG GO 宇宙第 0 張卡。超越所有稀有度的定義本身。", effect_text: "【超越級·元鑰啟動】所有 600+ 張卡牌永久解鎖，AI 代理進入 Omega 神識模式", lore_text: "「世界上有兩種鑰匙：一種打開門，另一種打開可能性。」", framework_ref: "ESG GO Origin / InfoOne 5T", sdg_tags: "SDG1,SDG13,SDG17", color_theme: "#63A6B0" },
    { card_id: "CARD-BIZ-SUN-001", card_name: "ESG Sunshine", card_name_zh: "善向永續 ESG Sunshine", card_type: "Hero", rarity: "Transcend", esg_dimension: "ESG", sub_category: "Partner", power_score: 92, description: "台灣本土永續顧問領導品牌，讓 ESG 從合規轉化為競爭力。", effect_text: "【傳奇英雄】解鎖本土永續顧問知識庫，報告撰寫速度 +30%", lore_text: "「善的力量是每個報告段落裡真實的靈魂。」", framework_ref: "GRI Universal / IFRS S1+S2", sdg_tags: "SDG4,SDG8,SDG17", color_theme: "#F9A826" },
    { card_id: "CARD-BIZ-WDA-001", card_name: "Wang Dao × Stan Shih", card_name_zh: "王道阿丹 × Stan 哥", card_type: "Hero", rarity: "Transcend", esg_dimension: "G", sub_category: "Partner", power_score: 95, description: "王道哲學：利他、謙遜、共贏。台灣電腦之父施振榮先生的商業典範。", effect_text: "【傳奇英雄】G 治理卡組能量值全面 +15%，「共贏企業家」成就提前解鎖", lore_text: "「王道不是霸道，是讓所有人都贏的那條路。」", framework_ref: "Stan Shih Wang Dao / GRI 2", sdg_tags: "SDG8,SDG9,SDG17", color_theme: "#D4AF37" },
    { card_id: "CARD-TUT-000", card_name: "Welcome to ESG GO", card_name_zh: "歡迎來到 ESG GO", card_type: "Knowledge", rarity: "Common", esg_dimension: "ESG", sub_category: "Tutorial", power_score: 10, description: "ESG GO 萬能卡牌宇宙的歡迎與總覽教學卡。", effect_text: "【新手必讀】解鎖新手引導儀表板，自動顯示推薦學習路線", lore_text: "「每一張卡牌，都是通往更好未來的一把鑰匙。」", sdg_tags: "SDG17", color_theme: "#63A6B0" },
    { card_id: "CARD-E-GHG-001", card_name: "Carbon Footprint Calculator", card_name_zh: "碳足跡計算師", card_type: "Knowledge", rarity: "Rare", esg_dimension: "E", sub_category: "GHG", power_score: 72, description: "掌握企業碳足跡計算方法論（Scope 1/2/3），建立精準的 GHG 盤查基礎。", effect_text: "【知識解鎖】解鎖 GHG Protocol 企業碳盤查工具箱", lore_text: "「計算碳，是減碳旅程的第一步。」", framework_ref: "GHG Protocol / GRI 305", sdg_tags: "SDG13", color_theme: "#40916C" },
    { card_id: "CARD-S-LAB-001", card_name: "Labour Standards Guardian", card_name_zh: "勞工標準守衛", card_type: "Knowledge", rarity: "Uncommon", esg_dimension: "S", sub_category: "Human Rights", power_score: 55, description: "了解並確保供應鏈中的勞工標準符合國際準則。", effect_text: "【知識解鎖】解鎖 ILO 八大核心公約自查清單", lore_text: "「標準是最低線，尊嚴才是目標。」", framework_ref: "GRI 407-409 / ILO", sdg_tags: "SDG8,SDG1", color_theme: "#F48FB1" },
    { card_id: "CARD-G-BOD-001", card_name: "Board Diversity Champion", card_name_zh: "董事多元性師", card_type: "Action", rarity: "Uncommon", esg_dimension: "G", sub_category: "Governance", power_score: 62, description: "推動董事會多元化，確保最優治理組合。", effect_text: "【行動】記錄董事會 DEI 組成，解鎖治理儀表板", lore_text: "「多元的聲音，才能看見更完整的風險與機遇。」", framework_ref: "GRI 2-9", sdg_tags: "SDG5,SDG16", color_theme: "#7E57C2" },
    { card_id: "CARD-FRM-GRI-001", card_name: "GRI Master Framework", card_name_zh: "GRI 框架大師", card_type: "Framework", rarity: "Rare", esg_dimension: "ESG", sub_category: "Framework", power_score: 75, description: "全球最廣泛採用的永續報告框架 GRI 通用準則。", effect_text: "【框架解鎖】解鎖 GRI 2024 全套指引工具箱", lore_text: "「GRI 不是規則，是向世界說清楚你在做什麼的語言。」", framework_ref: "GRI Universal Standards", sdg_tags: "SDG17", color_theme: "#D4AF37" },
    { card_id: "CARD-TUT-RULE-001", card_name: "What is ESG GO Omni Cards", card_name_zh: "何謂萬能卡牌系統", card_type: "Knowledge", rarity: "Common", esg_dimension: "ESG", sub_category: "Tutorial", power_score: 10, description: "萬能卡牌系統核心概念說明卡。", effect_text: "【新手必讀】解鎖卡牌系統完整說明文件", lore_text: "「卡牌是你永續旅程的座標與夥伴。」", sdg_tags: "SDG17", color_theme: "#63A6B0" },
];

const LOCKED_CARDS: OmniCardData[] = [
    { card_id: "CARD-ACT-NET-001", card_name: "Net Zero Pathway Planner", card_name_zh: "淨零路徑規劃師", card_type: "Challenge", rarity: "Epic", esg_dimension: "E", sub_category: "Climate", power_score: 85, description: "設計並提交符合 SBTi 標準的企業淨零路徑圖。", effect_text: "【史詩挑戰】制定 2030+2050 雙階段淨零目標", lore_text: "「淨零路徑是對未來義無反顧的承諾。」", framework_ref: "SBTi / TCFD", sdg_tags: "SDG13,SDG17", color_theme: "#2D6A4F" },
    { card_id: "CARD-ULT-001", card_name: "Platinum ESG Company", card_name_zh: "白金 ESG 企業", card_type: "Achievement", rarity: "Legendary", esg_dimension: "ESG", sub_category: "Ultimate", power_score: 97, description: "達到最高 ESG 整體績效的傳奇成就卡。", effect_text: "【傳奇成就】永久解鎖白金 ESG 頭像框", lore_text: "「白金不是目的，是每天努力的副產品。」", framework_ref: "GRI / B Corp", sdg_tags: "SDG17", color_theme: "#D4AF37" },
];

const ALL_CARDS = [...DEMO_BINDER_CARDS, ...LOCKED_CARDS];

type CardRarity = keyof typeof RARITY_CONFIG;
type FilterRarity = "ALL" | CardRarity;
type FilterDim = "ALL" | "E" | "S" | "G" | "ESG";
type ViewMode = "compact" | "grid" | "list" | "binder";

/* ── 緊湊行元件 */
function CompactRow({ card, onClick }: { card: OmniCardData; onClick?: () => void }) {
    const R = RARITY_CONFIG[card.rarity as CardRarity];
    const D = DIMENSION_CONFIG[card.esg_dimension] ?? DIMENSION_CONFIG.ESG;
    const T = TYPE_CONFIG[card.card_type];
    const color = card.color_theme ?? R.color;
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-xl border transition-all hover:scale-[1.005] cursor-pointer group"
            style={{
                background: `linear-gradient(90deg, ${color}0d, var(--theme-card-bg))`,
                borderColor: R.accent,
            }}
        >
            {/* 稀有度色條 */}
            <div className="w-1 h-8 rounded-full flex-none transition-all group-hover:h-10" style={{ background: color }} />
            {/* 類型圖示 */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-none text-sm"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                {T.icon}
            </div>
            {/* 卡名 */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-omni-text-main truncate leading-tight">{card.card_name_zh}</p>
                <p className="text-[9px] text-omni-text-muted font-mono truncate opacity-60">{card.card_name}</p>
            </div>
            {/* 框架 — 超寬桌機才顯示 */}
            {card.framework_ref && (
                <span className="hidden 2xl:block text-[9px] text-omni-text-muted font-mono truncate max-w-[110px] flex-none opacity-50">
                    {card.framework_ref}
                </span>
            )}
            {/* 卡型 — xl+ */}
            <span className="hidden xl:block text-[9px] font-mono text-omni-text-muted flex-none opacity-60">{T.label}</span>
            {/* 稀有度 */}
            <span className="text-[10px] font-bold font-mono flex-none hidden sm:block" style={{ color: R.color }}>{R.labelZh}</span>
            {/* 維度 */}
            <span className="text-[10px] font-bold flex-none px-1.5 py-0.5 rounded-full"
                style={{ color: D.color, background: D.bg }}>
                {D.icon} {card.esg_dimension}
            </span>
            {/* Power 圓環 */}
            <div className="flex-none w-8 h-8 rounded-full flex items-center justify-center relative"
                style={{ background: `conic-gradient(${color} ${card.power_score * 3.6}deg, rgba(128,128,128,0.08) 0deg)` }}>
                <div className="w-[60%] h-[60%] rounded-full flex items-center justify-center"
                    style={{ background: "var(--theme-card-bg)" }}>
                    <span className="text-[8px] font-bold font-mono" style={{ color }}>{card.power_score}</span>
                </div>
            </div>
        </div>
    );
}

/* ── 主頁面 */
export default function MyBinderPage() {
    const cardSize = useCardSize();
    const gridCols = useCardColumns("grid");
    const binderCols = useCardColumns("binder");

    const [view, setView] = useState<ViewMode>("compact");
    const [filterRarity, setFilterR] = useState<FilterRarity>("ALL");
    const [filterDim, setFilterD] = useState<FilterDim>("ALL");
    const [search, setSearch] = useState("");
    const [showLocked, setShowL] = useState(true);
    const [selected, setSelected] = useState<OmniCardData | null>(null);
    const [filtersOpen, setFiltersOpen] = useState(false);

    // +++ AUTH & DB STATE +++
    const [user, setUser] = useState<any>(null);
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        let mounted = true;
        import("@/lib/auth-client").then(({ getSession }) => {
            getSession().then(s => {
                if (!mounted) return;
                if (s.user) {
                    setUser(s.user);
                    import("@/lib/ncb-service").then(({ userProfilesApi }) => {
                        userProfilesApi.getCurrentProfile(s.user!.id).then(res => {
                            if (!mounted) return;
                            if (res.data && res.data.length > 0) {
                                const profile = res.data[0];
                                try {
                                    setUnlockedIds(JSON.parse(profile.unlocked_cards || "[]"));
                                } catch {
                                    setUnlockedIds([]);
                                }
                            }
                            setLoading(false);
                        });
                    });
                } else {
                    setLoading(false);
                }
            });
        });
        return () => { mounted = false; };
    }, []);

    const myOwnedCards = useMemo(() => ALL_CARDS.filter(c => unlockedIds.includes(c.card_id)), [unlockedIds]);
    const myLockedCards = useMemo(() => ALL_CARDS.filter(c => !unlockedIds.includes(c.card_id)), [unlockedIds]);

    const stats = {
        owned: myOwnedCards.length,
        total: ALL_CARDS.length,
        transcend: myOwnedCards.filter(c => c.rarity === "Transcend").length,
        power: myOwnedCards.reduce((s, c) => s + c.power_score, 0),
    };

    const filteredOwned = useMemo(() =>
        myOwnedCards.filter(c => {
            if (filterRarity !== "ALL" && c.rarity !== filterRarity) return false;
            if (filterDim !== "ALL" && c.esg_dimension !== filterDim) return false;
            if (search && !c.card_name_zh.includes(search) && !c.card_name.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        }), [myOwnedCards, filterRarity, filterDim, search]);

    const filteredLocked = useMemo(() =>
        myLockedCards.filter(c => {
            if (filterRarity !== "ALL" && c.rarity !== filterRarity) return false;
            if (filterDim !== "ALL" && c.esg_dimension !== filterDim) return false;
            if (search && !c.card_name_zh.includes(search) && !c.card_name.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        }), [myLockedCards, filterRarity, filterDim, search]);

    const getRarityColor = (r: string) => RARITY_CONFIG[r as CardRarity]?.color ?? "#94a3b8";
    const getRarityLabel = (r: string) => RARITY_CONFIG[r as CardRarity]?.labelZh ?? r;

    const VIEW_ICONS: Record<ViewMode, string> = { compact: "☰", grid: "⊞", list: "≡", binder: "📔" };

    return (
        <div className="flex flex-col gap-4 w-full animate-in fade-in duration-700 pb-24 md:pb-8">

            {/* ── 頁首 */}
            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xl sm:text-2xl">📔</span>
                        <h1 className="text-xl sm:text-2xl font-bold text-omni-text-main">我的萬能卡牌冊</h1>
                    </div>
                    <p className="text-xs text-omni-text-muted font-mono">
                        {loading ? "載入中..." : (user ? `My Omni Card Binder · ${user.name || user.email}` : "請登入以查看專屬卡牌")}
                    </p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: "擁有", value: stats.owned, color: "#22d3ee" },
                        { label: "總計", value: stats.total, color: "#94a3b8" },
                        { label: "超越", value: stats.transcend, color: "#63a6b0" },
                        { label: "能量", value: stats.power, color: "#fbbf24" },
                    ].map(s => (
                        <div key={s.label} className="liquid-glass-card px-2 py-1.5 flex flex-col items-center">
                            <span className="text-sm sm:text-base font-bold font-mono" style={{ color: s.color }}>{s.value.toLocaleString()}</span>
                            <span className="text-[9px] text-omni-text-muted">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 進度條 */}
            <div className="liquid-glass-card p-3 sm:p-4">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-mono text-omni-text-muted">收集進度</span>
                    <span className="text-xs font-mono text-omni-primary">{stats.owned}/{stats.total} ({Math.round(stats.owned / stats.total * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden border border-omni-glass-border" style={{ background: "var(--theme-card-bg)" }}>
                    <div className="h-full rounded-full" style={{ width: `${stats.owned / stats.total * 100}%`, background: "linear-gradient(90deg, var(--theme-primary), var(--theme-accent))", boxShadow: "0 0 8px var(--theme-primary)" }} />
                </div>
                <div className="flex gap-1.5 mt-2.5 flex-wrap">
                    {Object.entries(RARITY_CONFIG).map(([rarity, cfg]) => {
                        const count = DEMO_BINDER_CARDS.filter(c => c.rarity === rarity).length;
                        if (!count) return null;
                        return (
                            <div key={rarity} className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                                style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}28` }}>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                                <span className="text-[9px] font-mono" style={{ color: cfg.color }}>{cfg.labelZh}×{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── 控制列 */}
            <div className="flex flex-col gap-2">
                {/* 搜尋 + 視圖 */}
                <div className="flex gap-2">
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="🔍 搜尋卡牌名稱..."
                        className="flex-1 min-w-0 px-3 py-2 rounded-xl text-sm border text-omni-text-main placeholder:text-omni-text-muted outline-none focus:border-omni-primary transition-colors"
                        style={{ background: "var(--theme-glass-bg)", borderColor: "var(--theme-glass-border)" }} />
                    <button onClick={() => setFiltersOpen(v => !v)}
                        className={`sm:hidden px-3 py-2 rounded-xl border text-sm transition-all ${filtersOpen ? "text-omni-primary border-omni-primary/40" : "text-omni-text-muted border-omni-glass-border"}`}
                        style={{ background: "var(--theme-glass-bg)" }}>
                        篩 {filtersOpen ? "▲" : "▼"}
                    </button>
                    {/* 視圖切換 */}
                    <div className="flex gap-0.5 p-1 rounded-xl border border-omni-glass-border flex-none" style={{ background: "var(--theme-glass-bg)" }}>
                        {(["compact", "grid", "list", "binder"] as ViewMode[]).map(v => (
                            <button key={v} onClick={() => setView(v)} title={v}
                                className={`px-2 py-1.5 rounded-lg text-sm transition-all ${view === v ? "bg-omni-primary/20 text-omni-primary border border-omni-primary/40" : "text-omni-text-muted"}`}>
                                {VIEW_ICONS[v]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 篩選 */}
                <div className={`gap-2 flex-col sm:flex-row ${filtersOpen ? "flex" : "hidden sm:flex"}`}>
                    <div className="flex gap-1 p-1 rounded-xl border border-omni-glass-border overflow-x-auto flex-none" style={{ background: "var(--theme-glass-bg)" }}>
                        {(["ALL", "E", "S", "G", "ESG"] as FilterDim[]).map(d => (
                            <button key={d} onClick={() => setFilterD(d)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-none ${filterDim === d ? "bg-omni-primary/20 text-omni-primary border border-omni-primary/40" : "text-omni-text-muted hover:text-omni-text-main"}`}>
                                {d === "ALL" ? "全維度" : d}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1 p-1 rounded-xl border border-omni-glass-border overflow-x-auto flex-none" style={{ background: "var(--theme-glass-bg)" }}>
                        {(["ALL", "Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic", "Transcend"] as FilterRarity[]).map(r => (
                            <button key={r} onClick={() => setFilterR(r)}
                                style={filterRarity === r ? { color: getRarityColor(r), borderColor: `${getRarityColor(r)}50`, background: `${getRarityColor(r)}15` } : {}}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold font-mono whitespace-nowrap transition-all border flex-none ${filterRarity === r ? "border" : "border-transparent text-omni-text-muted hover:text-omni-text-main"}`}>
                                {r === "ALL" ? "ALL" : getRarityLabel(r)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 已擁有 */}
            <section>
                <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-1 h-5 rounded-full bg-omni-primary" />
                    <h2 className="text-sm font-bold text-omni-text-main font-mono">已擁有 · OWNED ({filteredOwned.length})</h2>
                </div>

                {/* 已擁有—資訊密集，最多 2 欄防破圖 */}
                {view === "compact" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {filteredOwned.map(card => (
                            <CompactRow key={card.card_id} card={card} onClick={() => setSelected(card)} />
                        ))}
                    </div>
                )}

                {/* Grid */}
                {view === "grid" && (
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`, gap: 14, justifyItems: "center" }}>
                        {filteredOwned.map(card => <OmniCard key={card.card_id} card={card} size={cardSize} />)}
                    </div>
                )}

                {/* List */}
                {view === "list" && (
                    <div className="flex flex-col gap-2">
                        {filteredOwned.map(card => <OmniMiniCard key={card.card_id} card={card} onClick={() => setSelected(card)} />)}
                    </div>
                )}

                {/* Binder */}
                {view === "binder" && (
                    <div className="liquid-glass-card p-3 sm:p-5">
                        <div style={{ display: "grid", gridTemplateColumns: `repeat(${binderCols}, minmax(0,1fr))`, gap: 10, justifyItems: "center" }}>
                            {filteredOwned.map(card => (
                                <div key={card.card_id} onClick={() => setSelected(card)} className="cursor-pointer hover:scale-105 transition-transform duration-200">
                                    <OmniCard card={card} size="sm" />
                                </div>
                            ))}
                            {Array.from({ length: Math.max(0, binderCols - (filteredOwned.length % binderCols || binderCols)) }).map((_, i) => (
                                <div key={i} className="rounded-xl border-2 border-dashed border-omni-glass-border flex items-center justify-center"
                                    style={{ width: 180, height: 270 }}>
                                    <span className="text-omni-text-muted text-3xl opacity-25">＋</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ── 未解鎖 */}
            {showLocked && filteredLocked.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-5 rounded-full bg-white/20" />
                            <h2 className="text-sm font-bold text-omni-text-muted font-mono">未解鎖 · LOCKED ({filteredLocked.length})</h2>
                        </div>
                        <button onClick={() => setShowL(false)} className="text-xs text-omni-text-muted hover:text-omni-text-main font-mono px-2 py-1">隱藏</button>
                    </div>

                    {/* 未解鎖—簡化顯示，可yield 3 欄 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 opacity-45 grayscale-[60%]">
                        {filteredLocked.map(card => (
                            <div key={card.card_id} style={{ position: "relative" }}>
                                <CompactRow card={card} />
                                <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(1px)" }}>
                                    <span style={{ fontSize: 14, marginRight: 6 }}>🔒</span>
                                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: "monospace" }}>未解鎖 LOCKED</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── 詳情 Modal */}
            {selected && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                    onClick={() => setSelected(null)}>
                    <div onClick={e => e.stopPropagation()}
                        className="flex flex-col items-center gap-4 animate-in slide-in-from-bottom sm:zoom-in duration-300 w-full sm:w-auto rounded-t-2xl sm:rounded-none pt-4 sm:pt-0 pb-8 sm:pb-0"
                        style={{ background: "var(--theme-glass-bg)", backdropFilter: "blur(20px)" }}>
                        <div className="w-10 h-1 rounded-full bg-white/20 sm:hidden mb-2" />
                        <OmniCard card={selected} size={cardSize === "sm" ? "md" : "lg"} />
                        <button onClick={() => setSelected(null)}
                            className="px-8 py-2.5 rounded-full border border-omni-glass-border text-omni-text-muted text-sm hover:bg-white/10 transition-colors font-mono"
                            style={{ background: "var(--theme-glass-bg)" }}>
                            關閉 ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
