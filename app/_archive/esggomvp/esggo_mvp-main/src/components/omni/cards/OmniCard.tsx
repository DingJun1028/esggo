"use client";

import React, { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════════════════════════════ */
export type CardRarity =
    | "Common" | "Uncommon" | "Rare" | "Epic"
    | "Legendary" | "Mythic" | "Transcend";

export type CardType =
    | "Knowledge" | "Action" | "Framework" | "Challenge"
    | "Event" | "Achievement" | "Wildcard" | "Hero";

export type ESGDimension = "E" | "S" | "G" | "ESG";

export interface OmniCardData {
    card_id: string;
    card_name: string;
    card_name_zh: string;
    card_type: CardType;
    rarity: CardRarity;
    esg_dimension: ESGDimension;
    sub_category: string;
    power_score: number;
    description: string;
    effect_text: string;
    lore_text: string;
    framework_ref?: string;
    sdg_tags?: string;
    color_theme?: string;
}

/* ═══════════════════════════════════════════════════════════════
   RARITY CONFIGURATION
   ═══════════════════════════════════════════════════════════════ */
export const RARITY_CONFIG = {
    Common: { labelZh: "通用", stars: 1, color: "#94a3b8", accent: "rgba(148,163,184,0.3)", glow: "", foil: false, shine: "transparent" },
    Uncommon: { labelZh: "罕見", stars: 2, color: "#34d399", accent: "rgba(52,211,153,0.35)", glow: "", foil: false, shine: "transparent" },
    Rare: { labelZh: "稀有", stars: 3, color: "#60a5fa", accent: "rgba(96,165,250,0.40)", glow: "", foil: false, shine: "transparent" },
    Epic: { labelZh: "史詩", stars: 4, color: "#c084fc", accent: "rgba(192,132,252,0.45)", glow: "", foil: false, shine: "transparent" },
    Legendary: { labelZh: "傳奇", stars: 5, color: "#fbbf24", accent: "rgba(251,191,36,0.50)", glow: "", foil: false, shine: "transparent" },
    Mythic: { labelZh: "神話", stars: 6, color: "#22d3ee", accent: "rgba(34,211,238,0.55)", glow: "", foil: false, shine: "transparent" },
    Transcend: { labelZh: "超越 ∞", stars: 7, color: "#009E9D", accent: "rgba(0,158,157,0.60)", glow: "", foil: false, shine: "transparent" },
} as const;

export const DIMENSION_CONFIG = {
    E: { label: "環境 E", color: "#34d399", bg: "rgba(52,211,153,0.12)", icon: "🌿" },
    S: { label: "社會 S", color: "#fb923c", bg: "rgba(251,146,60,0.12)", icon: "🤝" },
    G: { label: "治理 G", color: "#818cf8", bg: "rgba(129,140,248,0.12)", icon: "⚖️" },
    ESG: { label: "跨維 ∩", color: "#22d3ee", bg: "rgba(34,211,238,0.12)", icon: "♾️" },
} as const;

export const TYPE_CONFIG: Record<CardType, { icon: string; label: string; color: string }> = {
    Knowledge: { icon: "📚", label: "知識", color: "#60a5fa" },
    Action: { icon: "⚡", label: "行動", color: "#fb923c" },
    Framework: { icon: "🏛️", label: "框架", color: "#fbbf24" },
    Challenge: { icon: "🎯", label: "挑戰", color: "#f472b6" },
    Event: { icon: "🌀", label: "事件", color: "#a78bfa" },
    Achievement: { icon: "🏆", label: "成就", color: "#fbbf24" },
    Wildcard: { icon: "🔮", label: "萬用", color: "#22d3ee" },
    Hero: { icon: "🦸", label: "英雄", color: "#34d399" },
};

/* ═══════════════════════════════════════════════════════════════
   MAIN CARD COMPONENT
   ═══════════════════════════════════════════════════════════════ */
interface OmniCardProps {
    card: OmniCardData;
    size?: "sm" | "md" | "lg";
}

export function OmniCard({ card, size = "md" }: OmniCardProps) {
    const [flipped, setFlipped] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [shine, setShine] = useState({ x: 50, y: 50 });
    const cardRef = useRef<HTMLDivElement>(null);

    const R = RARITY_CONFIG[card.rarity];
    const D = DIMENSION_CONFIG[card.esg_dimension] ?? DIMENSION_CONFIG.ESG;
    const T = TYPE_CONFIG[card.card_type];
    const isTranscend = card.rarity === "Transcend";
    const isHighRarity = ["Epic", "Legendary", "Mythic", "Transcend"].includes(card.rarity);

    const cardColor = card.color_theme ?? R.color;
    const w = { sm: 180, md: 250, lg: 320 }[size];
    const h = { sm: 270, md: 375, lg: 480 }[size];

    // ── 3D tilt effect ──────────────────────────────────────────
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (flipped || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        setTilt({ x: dy * -8, y: dx * 8 });
        setShine({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    };
    const handleMouseLeave = () => { setTilt({ x: 0, y: 0 }); setShine({ x: 50, y: 50 }); };

    // ── Background gradient ──────────────────────────────────────
    const cardBg = isTranscend
        ? "linear-gradient(160deg, var(--theme-bg) 0%, #F1F3F5 100%)"
        : `linear-gradient(160deg, var(--theme-card-bg) 0%, #F1F3F5 100%)`;

    // ── Border ────────────────────────────────────────────────────
    const borderStyle: React.CSSProperties = isTranscend ? {
        border: "2px solid var(--theme-primary)",
    } : {
        border: `1.5px solid var(--theme-glass-border)`,
    };

    return (
        <div
            ref={cardRef}
            style={{ width: w, height: h, perspective: 1100, cursor: "pointer", userSelect: "none" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setFlipped(f => !f)}
        >
            <div
                style={{
                    width: "100%", height: "100%", position: "relative",
                    transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1)",
                    transformStyle: "preserve-3d",
                    transform: flipped
                        ? "rotateY(180deg)"
                        : `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.01)`,
                }}
            >
                {/* ════════════════ FRONT ════════════════ */}
                <div
                    style={{
                        position: "absolute", inset: 0, borderRadius: 12,
                        overflow: "hidden", backfaceVisibility: "hidden",
                        background: cardBg,
                        boxShadow: `0 2px 8px rgba(0,0,0,0.03)`,
                        ...borderStyle,
                    }}
                >

                    {/* ── Shine / Foil overlay ── */}
                    {isHighRarity && (
                        <div style={{
                            position: "absolute", inset: 0, borderRadius: 14, pointerEvents: "none", zIndex: 10,
                            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, ${R.shine} 0%, transparent 60%)`,
                            mixBlendMode: "screen",
                        }} />
                    )}

                    {/* ── Transcend animated border glow ── */}
                    {isTranscend && (
                        <div style={{
                            position: "absolute", inset: -1, borderRadius: 17, pointerEvents: "none", zIndex: 11,
                            background: "linear-gradient(160deg, #22d3ee44, #a78bfa44, #fbbf2444, #22d3ee44)",
                            backgroundSize: "300% 300%",
                            animation: "gradient-shift 5s ease infinite",
                            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            maskComposite: "exclude",
                            padding: "1px",
                        }} />
                    )}

                    {/* ── Decorative top banner ── */}
                    <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 6, borderRadius: "14px 14px 0 0",
                        background: isTranscend
                            ? "linear-gradient(90deg, #22d3ee, #a78bfa, #fbbf24, #22d3ee)"
                            : `linear-gradient(90deg, ${cardColor}cc, ${cardColor}44, transparent)`,
                        backgroundSize: "200% 100%",
                        animation: isHighRarity ? "gradient-shift 4s ease infinite" : "none",
                    }} />

                    {/* ── Main content ── */}
                    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: size === "sm" ? "10px 10px 8px" : "12px 12px 10px", gap: size === "sm" ? 6 : 8 }}>

                        {/* Header row */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                            {/* Rarity badge */}
                            <div style={{
                                padding: "2px 8px", borderRadius: 20,
                                background: `${R.accent}`,
                                border: `1px solid ${R.color}55`,
                                display: "flex", alignItems: "center", gap: 4,
                            }}>
                                <span style={{ fontSize: 9, fontWeight: 700, color: R.color, fontFamily: "monospace", letterSpacing: "0.05em" }}>
                                    {R.labelZh}
                                </span>
                            </div>
                            {/* Dimension badge */}
                            <div style={{
                                padding: "2px 8px", borderRadius: 20,
                                background: D.bg, border: `1px solid ${D.color}44`,
                                display: "flex", alignItems: "center", gap: 3,
                            }}>
                                <span style={{ fontSize: 9 }}>{D.icon}</span>
                                <span style={{ fontSize: 9, fontWeight: 700, color: D.color, fontFamily: "monospace" }}>{D.label}</span>
                            </div>
                        </div>

                        {/* Card Name */}
                        <div>
                            <p style={{
                                fontSize: size === "sm" ? 12 : size === "lg" ? 16 : 14,
                                fontWeight: 800, lineHeight: 1.25,
                                color: "var(--theme-text-main)",
                            }}>
                                {card.card_name_zh}
                            </p>
                            <p style={{ fontSize: 8, color: "var(--theme-text-muted)", fontFamily: "monospace", marginTop: 2, letterSpacing: "0.04em" }}>
                                {card.card_name}
                            </p>
                        </div>

                        {/* ── Art Area ── */}
                        <div style={{
                            flex: 1, borderRadius: 8, position: "relative", overflow: "hidden",
                            background: "#F8F9FA",
                            border: `1px solid var(--theme-glass-border)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexDirection: "column", gap: 6,
                        }}>
                            {/* Type icon */}
                            <span style={{
                                fontSize: size === "sm" ? 38 : size === "lg" ? 58 : 46,
                                lineHeight: 1,
                            }}>{T.icon}</span>

                            {/* Type label */}
                            <span style={{
                                fontSize: 9, letterSpacing: "0.18em", fontFamily: "monospace",
                                color: T.color, fontWeight: 700, textTransform: "uppercase",
                            }}>{T.label}</span>

                            {/* Stars */}
                            <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 2, alignItems: "center" }}>
                                {Array.from({ length: Math.min(R.stars, 6) }).map((_, i) => (
                                    <span key={i} style={{ fontSize: 7, opacity: 0.9 }}>★</span>
                                ))}
                                {isTranscend && <span style={{ fontSize: 10, color: "var(--theme-primary)", fontWeight: 900 }}>∞</span>}
                            </div>

                            {/* Power score */}
                            <div style={{
                                position: "absolute", bottom: 8, right: 8,
                                width: size === "sm" ? 28 : 34, height: size === "sm" ? 28 : 34,
                                borderRadius: "50%",
                                background: cardColor,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <div style={{
                                    width: "80%", height: "80%", borderRadius: "50%",
                                    background: "#F8F9FA",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <span style={{ fontSize: size === "sm" ? 8 : 9, fontWeight: 900, color: cardColor, fontFamily: "monospace" }}>
                                        {card.power_score}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card type + ID strip */}
                        <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "3px 6px", borderRadius: 6,
                            background: `${cardColor}0d`, border: `1px solid ${cardColor}1a`,
                        }}>
                            <span style={{ fontSize: 8, color: "var(--theme-text-muted)", fontFamily: "monospace", letterSpacing: "0.1em" }}>
                                {card.card_type.toUpperCase()} · {card.sub_category}
                            </span>
                            <span style={{ fontSize: 7, color: "var(--theme-text-muted)", fontFamily: "monospace", opacity: 0.5 }}>
                                {card.card_id.split("-").slice(-1)[0]}
                            </span>
                        </div>

                        {/* Description */}
                        <p style={{
                            fontSize: size === "sm" ? 9 : size === "lg" ? 11 : 10,
                            color: "var(--theme-text-sub)",
                            lineHeight: 1.5,
                            display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                        }}>
                            {card.description}
                        </p>

                        {/* Flip hint */}
                        <p style={{ textAlign: "center", fontSize: 8, color: "var(--theme-text-muted)", fontFamily: "monospace", opacity: 0.4 }}>
                            ↩ 點擊翻面
                        </p>
                    </div>

                    {/* ── Bottom decorative line ── */}
                    <div style={{
                        position: "absolute", bottom: 0, left: "20%", right: "20%", height: 2, borderRadius: 1,
                        background: `linear-gradient(90deg, transparent, ${cardColor}88, transparent)`,
                    }} />
                </div>

                {/* ════════════════ BACK ════════════════ */}
                <div
                    style={{
                        position: "absolute", inset: 0, borderRadius: 16,
                        overflow: "hidden", backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: cardBg,
                        boxShadow: `${R.glow}, 0 12px 40px rgba(0,0,0,0.5)`,
                        ...borderStyle,
                    }}
                >
                    {/* Shine overlay */}
                    {isHighRarity && (
                        <div style={{
                            position: "absolute", inset: 0, borderRadius: 14, pointerEvents: "none", zIndex: 10,
                            background: `radial-gradient(circle at 30% 30%, ${R.shine} 0%, transparent 60%)`,
                            mixBlendMode: "screen",
                        }} />
                    )}

                    {/* Top banner */}
                    <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 6, borderRadius: "14px 14px 0 0",
                        background: `linear-gradient(90deg, transparent, ${cardColor}cc, ${cardColor}44)`,
                    }} />

                    <div style={{
                        display: "flex", flexDirection: "column", height: "100%",
                        padding: size === "sm" ? "10px 10px 8px" : "12px 12px 10px",
                        gap: 7, overflowY: "auto", marginTop: 4,
                    }}>

                        {/* Card name */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 16, lineHeight: 1 }}>{T.icon}</span>
                            <div>
                                <p style={{ fontSize: size === "sm" ? 11 : 13, fontWeight: 800, color: "var(--theme-text-main)" }}>
                                    {card.card_name_zh}
                                </p>
                                <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                                    <span style={{ fontSize: 8, color: R.color, fontFamily: "monospace", fontWeight: 700 }}>{R.labelZh}</span>
                                    <span style={{ fontSize: 8, color: "var(--theme-text-muted)", fontFamily: "monospace" }}>· Power {card.power_score}</span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: `linear-gradient(90deg, ${cardColor}66, transparent)`, margin: "0 -4px" }} />

                        {/* Effect */}
                        <div style={{
                            padding: "8px 10px", borderRadius: 8,
                            background: `${cardColor}0d`, border: `1px solid ${cardColor}25`,
                        }}>
                            <p style={{ fontSize: 9, fontWeight: 700, color: T.color, marginBottom: 4, fontFamily: "monospace", letterSpacing: "0.08em" }}>
                                ⚡ 觸發效果
                            </p>
                            <p style={{ fontSize: size === "sm" ? 9 : 10, color: "var(--theme-text-sub)", lineHeight: 1.55 }}>
                                {card.effect_text}
                            </p>
                        </div>

                        {/* Lore */}
                        <div style={{
                            padding: "8px 10px", borderRadius: 8,
                            background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.18)",
                            fontStyle: "italic",
                        }}>
                            <p style={{ fontSize: 9, fontWeight: 700, color: "#fbbf24", marginBottom: 4, fontFamily: "monospace", letterSpacing: "0.08em" }}>
                                📖 Lore
                            </p>
                            <p style={{ fontSize: size === "sm" ? 9 : 10, color: "var(--theme-text-muted)", lineHeight: 1.55 }}>
                                {card.lore_text}
                            </p>
                        </div>

                        {/* Framework */}
                        {card.framework_ref && (
                            <div style={{
                                padding: "6px 10px", borderRadius: 8,
                                background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.18)",
                            }}>
                                <p style={{ fontSize: 9, fontWeight: 700, color: "#34d399", marginBottom: 3, fontFamily: "monospace", letterSpacing: "0.08em" }}>
                                    🏛 框架參考
                                </p>
                                <p style={{ fontSize: 9, color: "var(--theme-text-muted)", lineHeight: 1.5 }}>
                                    {card.framework_ref}
                                </p>
                            </div>
                        )}

                        {/* SDG Tags */}
                        {card.sdg_tags && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: "auto" }}>
                                {card.sdg_tags.split(",").slice(0, 8).map(tag => (
                                    <span key={tag} style={{
                                        padding: "2px 6px", borderRadius: 20,
                                        background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.25)",
                                        fontSize: 7, color: "#60a5fa", fontFamily: "monospace",
                                    }}>
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Flip hint */}
                        <p style={{ textAlign: "center", fontSize: 8, color: "var(--theme-text-muted)", fontFamily: "monospace", opacity: 0.35 }}>
                            ↩ 點擊翻回
                        </p>
                    </div>

                    {/* Bottom decorative */}
                    <div style={{
                        position: "absolute", bottom: 0, left: "20%", right: "20%", height: 2, borderRadius: 1,
                        background: `linear-gradient(90deg, transparent, ${cardColor}88, transparent)`,
                    }} />
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   CARD GRID COMPONENT — 供善向永續村 / 善向紀元 共用
   ═══════════════════════════════════════════════════════════════ */
interface OmniCardGridProps {
    cards: OmniCardData[];
    size?: "sm" | "md" | "lg";
    title?: string;
    subtitle?: string;
}

export function OmniCardGrid({ cards, size = "md", title, subtitle }: OmniCardGridProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {(title || subtitle) && (
                <div>
                    {title && <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--theme-text-main)" }}>{title}</h2>}
                    {subtitle && <p style={{ fontSize: 12, color: "var(--theme-text-muted)", fontFamily: "monospace", marginTop: 4 }}>{subtitle}</p>}
                </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
                {cards.map(card => (
                    <OmniCard key={card.card_id} card={card} size={size} />
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MINI CARD — 列表/預覽用小版本（善向紀元事件流使用）
   ═══════════════════════════════════════════════════════════════ */
interface MiniCardProps {
    card: OmniCardData;
    onClick?: () => void;
}

export function OmniMiniCard({ card, onClick }: MiniCardProps) {
    const R = RARITY_CONFIG[card.rarity];
    const D = DIMENSION_CONFIG[card.esg_dimension] ?? DIMENSION_CONFIG.ESG;
    const T = TYPE_CONFIG[card.card_type];
    const cardColor = card.color_theme ?? R.color;

    return (
        <div
            onClick={onClick}
            style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 8, cursor: onClick ? "pointer" : "default",
                background: "var(--theme-bg)",
                border: `1.5px solid var(--theme-glass-border)`,
                transition: "all 0.2s ease",
            }}
            className="hover:translate-y-[-1px] hover:border-[var(--theme-primary)]/30 shadow-sm"
        >
            <div style={{
                width: 32, height: 32, borderRadius: 4,
                background: "#F1F3F5",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
            }}>
                {T.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--theme-text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {card.card_name_zh}
                </p>
                <div style={{ display: "flex", gap: 6, marginTop: 2, alignItems: "center" }}>
                    <span style={{ fontSize: 9, color: R.color, fontFamily: "monospace", fontWeight: 700 }}>{R.labelZh}</span>
                    <span style={{ fontSize: 9, color: D.color }}>{D.icon} {card.esg_dimension}</span>
                </div>
            </div>

            <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: cardColor,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
                <div style={{ width: "80%", height: "80%", borderRadius: "50%", background: "#F1F3F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 8, fontWeight: 900, color: cardColor, fontFamily: "monospace" }}>{card.power_score}</span>
                </div>
            </div>
        </div>
    );
}
