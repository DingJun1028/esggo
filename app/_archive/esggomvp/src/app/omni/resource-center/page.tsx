'use client';

import React from 'react';
import {
    Search,
    BookOpen,
    Sparkles,
    Database,
    FileText,
    ShieldCheck,
    LayoutGrid,
    Plus,
    ArrowRight
} from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { TrustBadgeGroup } from '@/components/omni/verification/TrustBadgeGroup';
import { OmniComicStrip, ComicPanel } from '@/components/omni/cards/OmniComicStrip';
import { cn } from '@/lib/utils';

const comicPanels: [ComicPanel, ComicPanel, ComicPanel, ComicPanel] = [
    { id: '1', title: '知識孤島', description: '企業內永續規範與查核標準多散落於各處，難以有效整合與追溯。', color: 'danger' },
    { id: '2', title: '全能智庫', description: '資源中心作為企業的 Gnosis Library，將所有規範進行 5T 原子化建檔。', color: 'primary' },
    { id: '3', title: '雙向引導', description: '資源庫不僅供人閱讀，更能作為 AI 代理與驗算引擎的底層合規參照。', color: 'accent' },
    { id: '4', title: '知識即資產', description: '隨時掌握最新永續趨勢，將每一次的知識擴充化為驅動轉型的無形資產。', color: 'success' }
];

const LIBRARY_ASSETS = [
    {
        id: 'ast-1',
        title: '2026 永續策略框架',
        description: '涵蓋系統性永續轉型的綜合指南，並與核心治理目標完全對齊。',
        tag: 'Tangible',
        type: '策略指標'
    },
    {
        id: 'ast-2',
        title: '碳帳本總目錄 v4',
        description: '範疇一至三的溫室氣體排放數據，具備不可篡改的驗證證明與全域追溯溯源。',
        tag: 'Traceable',
        type: '核心數據'
    },
    {
        id: 'ast-3',
        title: '全球風險查核基準',
        description: '針對跨境合規性與法規風險緩解的動態審計結果分析。',
        tag: 'Trustworthy',
        type: '合規準則'
    },
    {
        id: 'ast-4',
        title: 'AI 倫理政策審計',
        description: '確保 AI 代理在數位主權框架下符合倫理對齊標準的問責報告。',
        tag: 'Transparent',
        type: '審計報告'
    },
    {
        id: 'ast-5',
        title: '影響力修復紀錄',
        description: '生態環境修復進度與自然資本復原狀態的追蹤日誌。',
        tag: 'Trackable',
        type: '環境修復'
    }
];

export default function GnosisLibraryPage() {
    return (
        <div className="flex flex-col gap-10">
            {/* Header Area */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                        Gnosis <span className="text-omni-primary">Library</span>
                    </h1>
                    <p className="text-slate-500 mt-2 max-w-xl text-sm">
                        萬能知識資產中樞 (Universal Knowledge Assets Hub)。在這裡，5T 驗證數據與系統性智慧相互交融，將每一次學習轉化為真實的企業資產。
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="搜尋永續知識資產..."
                            className="bg-slate-100 border border-slate-200 rounded-2xl pl-12 pr-6 py-3 w-72 text-sm text-slate-700 focus:ring-2 focus:ring-omni-primary/30 focus:border-omni-primary/50 transition-all outline-none"
                        />
                    </div>
                </div>
            </header>

            <div className="mb-2 max-w-7xl mx-auto w-full">
                <OmniComicStrip panels={comicPanels} />
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {LIBRARY_ASSETS.map((asset) => (
                    <LiquidGlassContainer key={asset.id} className="p-8 group hover:-translate-y-1 hover:shadow-xl hover:shadow-omni-primary/5 transition-all duration-300 bg-white border border-slate-200 cursor-pointer">
                        <div className="flex justify-between items-start mb-6">
                            <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-omni-primary group-hover:bg-omni-primary group-hover:text-white transition-colors duration-300">
                                {asset.tag === 'Tangible' && <Sparkles size={24} />}
                                {asset.tag === 'Traceable' && <Database size={24} />}
                                {asset.tag === 'Trustworthy' && <ShieldCheck size={24} />}
                                {asset.tag === 'Transparent' && <FileText size={24} />}
                                {asset.tag === 'Trackable' && <BookOpen size={24} />}
                            </div>
                            <span className="text-[10px] font-black tracking-widest uppercase text-slate-500 px-2 py-1 bg-slate-100 rounded">
                                {asset.type}
                            </span>
                        </div>

                        <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-omni-primary transition-colors">
                            {asset.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-8 line-clamp-3 min-h-[60px]">
                            {asset.description}
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                            <TrustBadgeGroup
                                size="sm"
                                showLabel={false}
                                status={{
                                    tangible: asset.tag === 'Tangible',
                                    traceable: asset.tag === 'Traceable',
                                    trackable: asset.tag === 'Trackable',
                                    transparent: asset.tag === 'Transparent',
                                    trustworthy: asset.tag === 'Trustworthy'
                                }}
                            />
                            <button className="size-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-omni-primary group-hover:border-omni-primary group-hover:text-white transition-all">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </LiquidGlassContainer>
                ))}

                {/* Manifest New Asset Card */}
                <div className="rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 gap-4 hover:border-omni-primary/50 hover:bg-omni-primary/5 transition-all group cursor-pointer aspect-[360/260] bg-slate-50/50">
                    <div className="size-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-omni-primary group-hover:text-omni-primary transition-all">
                        <Plus size={32} />
                    </div>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-omni-primary transition-all tracking-wide">
                        建立新知識資產
                    </span>
                </div>
            </div>

            {/* Bottom Insight Section */}
            <section className="mt-12 bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/10">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
                        知識就是實質 <span className="text-omni-primary">資產</span>
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-8">
                        Gnosis Library 中的每一個經 5T 協議驗證的知識原子，都在為您的企業提升系統性 ESG 價值。在「服務即教學，知識即資產」的時代，您的集體大腦智慧就是推動永續轉型的最大資本。
                    </p>
                    <button className="px-8 py-4 bg-omni-primary text-white rounded-2xl font-black shadow-lg shadow-omni-primary/20 hover:bg-omni-primary/90 hover:scale-105 active:scale-95 transition-all">
                        進入深層智庫
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-omni-primary/20 to-transparent pointer-events-none" />
                <BookOpen size={240} className="absolute -bottom-20 -right-20 opacity-5 -rotate-12 pointer-events-none text-white" />
            </section>
        </div>
    );
}
