'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Factory, FileText, Sparkles, Globe, Download, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { OmniComicStrip, ComicPanel } from '@/components/omni/cards/OmniComicStrip';

const comicPanels: [ComicPanel, ComicPanel, ComicPanel, ComicPanel] = [
    { id: '1', title: '框架選擇', description: '針對不同利害關係人的需求，選擇合適的 GRI、SASB 或 TCFD 標準框架。', color: 'primary' },
    { id: '2', title: 'AI 智能敘事', description: 'Sentient Wizard 引擎讀取 5T 原子數據，自動轉化為具備商業洞察的精準敘事。', color: 'accent' },
    { id: '3', title: '多語系雙軸', description: '一鍵切換多國語言版本，突破語言障礙，展現企業全球化 ESG 布局。', color: 'success' },
    { id: '4', title: '靈知匯出', description: '將最終確定的報告與敘事匯出，做為企業重要數位資產並進入發佈流程。', color: 'danger' }
];

// --- Types ---
interface Template {
    id: string;
    name: string;
    standard: string;
    description: string;
    color: string;
    sections: string[];
}

const TEMPLATES: Template[] = [
    {
        id: 'gri',
        name: 'GRI 通用揭露',
        standard: 'GRI Universal Standards 2021',
        description: '全球最廣泛採用的永續報告框架，含 E、S、G 三大主題揭露。',
        color: 'from-blue-500',
        sections: ['組織描述 (2-1)', '戰略、政策與實踐 (2-22)', '環境指標 (305-1/2/3)', '社會指標 (401-1)', '治理指標 (205-3)'],
    },
    {
        id: 'sasb',
        name: 'SASB 行業標準',
        standard: 'SASB Industry Standards 2023',
        description: '產業特定實質性議題揭露，提升投資人可比較性。',
        color: 'from-purple-500',
        sections: ['實質性議題識別', '能源管理', '水資源管理', '廢棄物管理', '員工健康與安全'],
    },
    {
        id: 'tcfd',
        name: 'TCFD 氣候財務揭露',
        standard: 'TCFD Recommendations 2023',
        description: '聚焦氣候相關財務風險與機遇，符合 ISSB 過渡要求。',
        color: 'from-emerald-500',
        sections: ['治理 (Governance)', '策略 (Strategy)', '風險管理 (Risk Mgmt)', '指標與目標 (Metrics)'],
    },
];

const LANGUAGES = [
    { code: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
];

// --- Mock AI Narrative ---
const MOCK_NARRATIVES: Record<string, string> = {
    gri: `本公司致力於在環境永續、社會責任與優良治理三大核心領域持續精進。2025年度，本公司 Scope 1 直接碳排放為 12,450 tCO2e，較上年度下降 8.2%，成功超越預訂的 5% 節能目標。在社會關懷面，我們提供超過 1,200 名員工完整的健康與安全培訓…`,
    sasb: `作為科技製造業，本公司最重要的實質性議題涵蓋能源管理、製程廢棄物及員工健康安全。2025 年，單位產品能耗強度較基準年下降 15.3%、可再生能源佔比達 32%，符合 RE100 路線圖進程…`,
    tcfd: `氣候變遷對本公司的短中長期業務運營構成實體與轉型雙重風險。依據 TCFD 框架評估，本公司已識別出 3 項高度實質性氣候風險：颱風造成廠區停工（實體風險）、碳邊境調整機制 CBAM 對出口利潤的衝擊（轉型風險）、以及水資源供應緊縮（慢速發展風險）…`,
};

export default function ReportFactoryPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [selectedLang, setSelectedLang] = useState('zh-TW');
    const [isGenerating, setIsGenerating] = useState(false);
    const [narrative, setNarrative] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!selectedTemplate) return;
        setIsGenerating(true);
        setNarrative(null);
        // Simulate AI generation delay
        await new Promise(r => setTimeout(r, 2000));
        setNarrative(MOCK_NARRATIVES[selectedTemplate.id] || MOCK_NARRATIVES['gri']);
        setIsGenerating(false);
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <header>
                <div className="flex items-center gap-4 mb-4">
                    <div className="size-12 bg-omni-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-omni-primary/30">
                        <Factory size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-omni-text-main">
                            報告編寫室 <span className="text-omni-primary">(Foundry Factory)</span>
                        </h1>
                        <p className="text-omni-text-sub mt-1">選定框架 → Sentient Wizard AI 敘事 → 5T 映射輸出。將原子數據轉化為有溫度的影響力故事。</p>
                    </div>
                </div>
            </header>

            <div className="mb-6">
                <OmniComicStrip panels={comicPanels} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left: Template selector + Language */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Step 1: Template */}
                    <LiquidGlassContainer className="p-6 space-y-4">
                        <h2 className="text-sm font-black text-omni-text-muted uppercase tracking-widest flex items-center gap-2">
                            <span className="size-5 bg-omni-primary text-white rounded-full text-[10px] flex items-center justify-center">1</span>
                            選擇報告框架
                        </h2>
                        <div className="space-y-3">
                            {TEMPLATES.map((t) => (
                                <motion.button
                                    key={t.id}
                                    onClick={() => { setSelectedTemplate(t); setNarrative(null); }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedTemplate?.id === t.id
                                        ? 'border-omni-primary bg-omni-primary/5'
                                        : 'border-omni-glass-border hover:border-omni-primary/40'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-black text-omni-text-main">{t.name}</span>
                                        {selectedTemplate?.id === t.id && <CheckCircle size={16} className="text-omni-primary" />}
                                    </div>
                                    <span className="text-[10px] font-mono text-omni-text-muted">{t.standard}</span>
                                    <p className="text-xs text-omni-text-sub mt-1 leading-relaxed">{t.description}</p>
                                </motion.button>
                            ))}
                        </div>
                    </LiquidGlassContainer>

                    {/* Step 2: Language */}
                    <LiquidGlassContainer className="p-6 space-y-4">
                        <h2 className="text-sm font-black text-omni-text-muted uppercase tracking-widest flex items-center gap-2">
                            <span className="size-5 bg-omni-primary text-white rounded-full text-[10px] flex items-center justify-center">2</span>
                            <Globe size={14} /> 輸出語言
                        </h2>
                        <div className="grid grid-cols-2 gap-2">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setSelectedLang(lang.code)}
                                    className={`p-3 rounded-xl border text-sm font-bold transition-all flex items-center gap-2 ${selectedLang === lang.code
                                        ? 'border-omni-primary bg-omni-primary/10 text-omni-primary'
                                        : 'border-omni-glass-border text-omni-text-sub hover:border-omni-primary/40'
                                        }`}
                                >
                                    <span>{lang.flag}</span> {lang.label}
                                </button>
                            ))}
                        </div>
                    </LiquidGlassContainer>

                    {/* Generate button */}
                    <motion.button
                        onClick={handleGenerate}
                        disabled={!selectedTemplate || isGenerating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-4 bg-omni-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-omni-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <><Loader2 size={20} className="animate-spin" /> AI 敘事引擎運行中…</>
                        ) : (
                            <><Sparkles size={20} /> 生成永續敘事</>
                        )}
                    </motion.button>
                </div>

                {/* Right: Preview */}
                <div className="lg:col-span-3 space-y-6">
                    {selectedTemplate && (
                        <LiquidGlassContainer className="p-6 space-y-4">
                            <h2 className="text-sm font-black text-omni-text-muted uppercase tracking-widest flex items-center gap-2">
                                <FileText size={14} /> 章節結構預覽
                            </h2>
                            <div className="space-y-2">
                                {selectedTemplate.sections.map((s, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-omni-surface-2">
                                        <span className="size-5 bg-omni-primary/10 text-omni-primary rounded-full text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                                        <span className="text-sm text-omni-text-main font-medium">{s}</span>
                                        <ChevronRight size={14} className="ml-auto text-omni-text-muted" />
                                    </div>
                                ))}
                            </div>
                        </LiquidGlassContainer>
                    )}

                    {/* Output area */}
                    <AnimatePresence>
                        {isGenerating && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-8 rounded-3xl border border-dashed border-omni-primary/40 flex flex-col items-center justify-center gap-4 min-h-[300px] relative overflow-hidden"
                            >
                                <Sparkles size={40} className="text-omni-primary animate-pulse" />
                                <div className="text-center space-y-2 relative z-10">
                                    <p className="text-omni-primary font-black uppercase tracking-widest text-sm">Sentient-Narrative Forge</p>
                                    <p className="text-[10px] text-omni-text-sub max-w-xs mx-auto uppercase">正在比對 NCB 原子數據並執行 4D 時空座標 (XYZ+W) 對焦...</p>
                                </div>
                                <div className="w-48 h-1 bg-omni-primary/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-omni-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-omni-primary/5 to-transparent pointer-events-none" />
                            </motion.div>
                        )}
                        {narrative && !isGenerating && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <LiquidGlassContainer className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-sm font-black text-omni-text-muted uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle size={14} className="text-green-500" /> AI 生成敘事結果
                                        </h2>
                                        <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-[10px] font-bold rounded-full border border-green-500/20">
                                            {LANGUAGES.find(l => l.code === selectedLang)?.flag} {LANGUAGES.find(l => l.code === selectedLang)?.label}
                                        </span>
                                    </div>
                                    <div className="p-4 bg-omni-surface-2 rounded-xl">
                                        <p className="text-sm text-omni-text-main leading-relaxed whitespace-pre-line">{narrative}</p>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button className="flex-1 py-2.5 bg-omni-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                                            <Download size={16} /> 匯出 PDF
                                        </button>
                                        <button className="flex-1 py-2.5 border border-omni-glass-border text-omni-text-main rounded-xl font-bold text-sm hover:border-omni-primary transition-all">
                                            繼續編輯
                                        </button>
                                    </div>
                                </LiquidGlassContainer>
                            </motion.div>
                        )}
                        {!selectedTemplate && !isGenerating && !narrative && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-12 rounded-3xl border border-dashed border-omni-glass-border flex flex-col items-center justify-center gap-3 min-h-[300px]"
                            >
                                <Factory size={48} className="text-omni-text-muted opacity-20" />
                                <p className="text-omni-text-sub font-bold">請先從左側選擇一個報告框架</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
