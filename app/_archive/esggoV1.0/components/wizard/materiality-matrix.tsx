"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid, Cell } from "recharts";
import { Info } from "lucide-react";

// Design Tokens (Luxury Dark Mode)
const DARK_BG = "#0B0C0A";
const INK_LIGHT = "#151614";
const BORDER = "#2A2A26";
const TEXT_MUTED = "#8A8A83";
const TEXT_BRIGHT = "#F4F4F0";
const ACCENT_GOLD = "#C9A84C";
const ACCENT_GREEN = "#2D6A4F";
const ACCENT_BLUE = "#3B82F6";
const ACCENT_ORANGE = "#F97316";

export interface MaterialityTopic {
    id: string;
    topic: string;
    impactScore: number; // 1-100 (X Axis - Impact Materiality)
    financeScore: number; // 1-100 (Y Axis - Financial Materiality)
    priority: number; // Bubble Size
    category: "E" | "S" | "G";
    rationale: string;
}

const MOCK_TOPICS: MaterialityTopic[] = [
    { id: "e1", topic: "溫室氣體排放 (Scope 1-3)", impactScore: 92, financeScore: 88, priority: 1, category: "E", rationale: "碳費徵收與供應鏈淨零要求，對財務影響極大。" },
    { id: "e2", topic: "能源管理與轉型", impactScore: 85, financeScore: 78, priority: 2, category: "E", rationale: "高耗能產業面臨的綠電溢價與能效提升投資。" },
    { id: "e3", topic: "水資源與廢棄物", impactScore: 70, financeScore: 60, priority: 3, category: "E", rationale: "製程用水與循環經濟法規遵循。" },
    { id: "s1", topic: "職業安全與健康", impactScore: 80, financeScore: 65, priority: 3, category: "S", rationale: "職災頻率影響品牌聲譽與勞動成本。" },
    { id: "s2", topic: "多元、平等與包容 (DEI)", impactScore: 60, financeScore: 40, priority: 5, category: "S", rationale: "國際人才招募與保留的軟性競爭力。" },
    { id: "s3", topic: "供應商社會評估", impactScore: 75, financeScore: 70, priority: 4, category: "S", rationale: "斷鏈風險與跨國人權法規要求。" },
    { id: "g1", topic: "資訊安全與隱私", impactScore: 88, financeScore: 95, priority: 1, category: "G", rationale: "勒索軟體攻擊造成的營運中斷與鉅額罰款風險。" },
    { id: "g2", topic: "商業道德與反貪腐", impactScore: 65, financeScore: 80, priority: 4, category: "G", rationale: "合規經營底線，影響投資法人信任度。" },
    { id: "g3", topic: "董事會組成與績效", impactScore: 50, financeScore: 65, priority: 5, category: "G", rationale: "公司治理評鑑要求與決策多元性。" }
];

const categoryColors = {
    E: ACCENT_GREEN,
    S: ACCENT_BLUE,
    G: ACCENT_GOLD
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as MaterialityTopic;
        return (
            <div className="p-4 rounded-2xl shadow-2xl z-50 backdrop-blur-md" style={{ backgroundColor: "rgba(21, 22, 20, 0.95)", border: `1px solid ${BORDER}`, minWidth: "250px" }}>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: `${categoryColors[data.category]}20`, color: categoryColors[data.category] }}>
                        {data.category}
                    </span>
                    <h4 className="text-sm font-bold" style={{ color: TEXT_BRIGHT }}>{data.topic}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 pb-3 border-b border-white/5">
                    <div>
                        <p className="text-[9px] uppercase tracking-widest font-black" style={{ color: TEXT_MUTED }}>衝擊 (環境/社會)</p>
                        <p className="font-mono font-bold" style={{ color: TEXT_BRIGHT }}>{data.impactScore} <span className="text-[10px] text-white/30">/100</span></p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-widest font-black" style={{ color: TEXT_MUTED }}>財務 (企業價值)</p>
                        <p className="font-mono font-bold" style={{ color: TEXT_BRIGHT }}>{data.financeScore} <span className="text-[10px] text-white/30">/100</span></p>
                    </div>
                </div>
                <div>
                    <p className="text-[10px] leading-relaxed" style={{ color: TEXT_MUTED }}>
                        {data.rationale}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export function MaterialityMatrix({ topics = MOCK_TOPICS }: { topics?: MaterialityTopic[] }) {
    const [selectedCategory, setSelectedCategory] = useState<"ALL" | "E" | "S" | "G">("ALL");

    const filteredTopics = topics.filter(t => selectedCategory === "ALL" || t.category === selectedCategory);

    return (
        <div className="w-full flex flex-col pt-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-black tracking-tight flex items-center gap-2" style={{ color: TEXT_BRIGHT }}>
                        雙重重大性矩陣 <span style={{ color: TEXT_MUTED, fontSize: '0.6em', fontWeight: 'bold' }}>(Double Materiality)</span>
                    </h3>
                    <p className="text-xs font-medium mt-1" style={{ color: TEXT_MUTED }}>
                        符合 GRI 3 與 ESRS 規範，評估各議題對環境社會及財務之雙向影響。
                    </p>
                </div>
                <div className="flex bg-[#151614] rounded-xl p-1 border border-white/5">
                    {["ALL", "E", "S", "G"].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat as any)}
                            className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                            style={{
                                backgroundColor: selectedCategory === cat ? (cat === "ALL" ? "#2A2A26" : `${categoryColors[cat as "E" | "S" | "G"]}30`) : "transparent",
                                color: selectedCategory === cat ? (cat === "ALL" ? TEXT_BRIGHT : categoryColors[cat as "E" | "S" | "G"]) : TEXT_MUTED
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative w-full h-[400px] bg-[#151614] rounded-3xl p-6 border border-white/5 overflow-hidden group">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A26" vertical={false} horizontal={false} />

                        {/* Reference lines (Quadrants) */}
                        <ReferenceLine x={50} stroke="#2A2A26" strokeDasharray="3 3" />
                        <ReferenceLine y={50} stroke="#2A2A26" strokeDasharray="3 3" />

                        <XAxis
                            type="number"
                            dataKey="impactScore"
                            name="衝擊重大性"
                            domain={[0, 100]}
                            tick={{ fontSize: 10, fill: TEXT_MUTED }}
                            axisLine={{ stroke: BORDER }}
                            label={{ value: "衝擊重大性 (Impact Materiality) →", position: "insideBottom", offset: -10, fill: TEXT_MUTED, fontSize: 10, fontWeight: "bold" }}
                        />
                        <YAxis
                            type="number"
                            dataKey="financeScore"
                            name="財務重大性"
                            domain={[0, 100]}
                            tick={{ fontSize: 10, fill: TEXT_MUTED }}
                            axisLine={{ stroke: BORDER }}
                            label={{ value: "財務重大性 (Financial Materiality) →", angle: -90, position: "insideLeft", offset: -10, fill: TEXT_MUTED, fontSize: 10, fontWeight: "bold" }}
                        />
                        <ZAxis type="number" dataKey="priority" range={[100, 800]} name="優先級" />

                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#2A2A26' }} />

                        <Scatter data={filteredTopics} animationDuration={1000}>
                            {filteredTopics.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={categoryColors[entry.category]}
                                    fillOpacity={0.8}
                                    style={{
                                        filter: `drop-shadow(0px 0px 8px ${categoryColors[entry.category]}60)`,
                                        cursor: "pointer"
                                    }}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>

                {/* Quadrant Labels */}
                <div className="absolute top-6 right-6 text-[10px] font-black tracking-widest uppercase opacity-40" style={{ color: TEXT_BRIGHT }}>高度關注區</div>
                <div className="absolute bottom-6 left-12 text-[10px] font-black tracking-widest uppercase opacity-20" style={{ color: TEXT_MUTED }}>日常管理區</div>

                {/* Floating Info */}
                <div className="absolute top-4 left-4 p-2 bg-black/50 backdrop-blur rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-2 max-w-full md:w-[200px]">
                    <Info className="w-3 h-3 mt-0.5" style={{ color: ACCENT_GOLD }} />
                    <p className="text-[9px] leading-relaxed" style={{ color: TEXT_MUTED }}>
                        氣泡大小代表相對於同業標竿的<strong className="text-white">風險急迫性</strong>。越往右上角，代表同時面臨高度環境衝擊與財務影響。
                    </p>
                </div>
            </div>
        </div>
    );
}
