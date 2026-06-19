'use client';

/**
 * 🏛️ 戰略偵情儀表板 (Strategic Reconnaissance Dashboard)
 * 視覺：高密度自適應網格 + 液態玻璃 (Liquid Glass)
 * 功能：S1-S5 即時情資監測、5T 協議門驗證展示
 */
import React, { useState, useEffect } from 'react';
import { ReconCenter } from '@/core/omni-recon-center';
import { IIntelNode5T, ReconCategory, RECON_TAXONOMY } from '@/types/omni/recon.types';
import { IntelCard5T } from '@/components/omni/recon/IntelCard5T';
import { Shield, Zap, RefreshCw, BarChart3, Globe, Layers, Cpu, Landmark } from 'lucide-react';

// 模擬原始情報數據源
const MOCK_INTEL_SOURCES: Record<ReconCategory, any[]> = {
    S1: [
        { title: 'UN Plastic Treaty v2.0', insight: 'Global mandatory recycling quotas incoming. Supply chain audit required.', risk_score: 75, source_url: 'https://unep.org/treaty-update' },
        { title: 'EU Carbon Border Adjustment Mechanism (CBAM)', insight: 'Extended scope to hydrogen and polymers. Verify export footprints.', risk_score: 92, source_url: 'https://ec.europa.eu/taxation_customs/' }
    ],
    S2: [
        { title: 'ISSB S1/S2 Mandatory Adoption', insight: 'IFRS S1/S2 now legal requirement in 15 jurisdictions. GAAP mapping needed.', risk_score: 88, source_url: 'https://ifrs.org/issb' }
    ],
    S3: [
        { title: 'Garten Intelligence: AI in ESG', insight: 'Generative AI to automate 60% of sustainability reporting by 2027.', risk_score: 45, source_url: 'https://gartner.com/esg-trends' }
    ],
    S4: [
        { title: 'Green Bond Taxonomy Revise', insight: 'Stricter "Transition Finance" definitions. Refinancing risks for gas assets.', risk_score: 68, source_url: 'https://climatebonds.net' }
    ],
    S5: [
        { title: 'Solid-State Battery Breakthrough', insight: 'Toyota pilot production ahead of schedule. EV supply chain shift expected.', risk_score: 55, source_url: 'https://reuters.com/tech/ev' }
    ]
};

export default function ReconDashboard() {
    const [activeIntel, setActiveIntel] = useState<IIntelNode5T[]>([]);
    const [isIngesting, setIsIngesting] = useState(false);
    const [activeCategory, setActiveCategory] = useState<ReconCategory | 'ALL'>('ALL');

    // 初始載入：模擬從 Gateway 處理情資
    useEffect(() => {
        const initialNodes: IIntelNode5T[] = [];
        Object.keys(MOCK_INTEL_SOURCES).forEach((cat) => {
            const catSources = MOCK_INTEL_SOURCES[cat as ReconCategory];
            catSources.forEach(s => {
                initialNodes.push(ReconCenter.ingestingIntelSync(s, cat as ReconCategory));
            });
        });
        setActiveIntel(initialNodes);
    }, []);

    // 模擬即時情資攝入
    const handleManualIngest = async () => {
        setIsIngesting(true);
        // 隨機選一個分類
        const categories: ReconCategory[] = ['S1', 'S2', 'S3', 'S4', 'S5'];
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        const source = MOCK_INTEL_SOURCES[randomCat][0]; // 簡單取第一個
        
        const newNode = await ReconCenter.ingestingIntel(
            { ...source, title: `${source.title} [UPDATED-${Date.now().toString().slice(-4)}]` }, 
            randomCat
        );
        
        setActiveIntel(prev => [newNode, ...prev].slice(0, 20)); // 保留最新 20 筆
        setTimeout(() => setIsIngesting(false), 800);
    };

    const filteredIntel = activeCategory === 'ALL' 
        ? activeIntel 
        : activeIntel.filter(i => i.category === activeCategory);

    return (
        <div className="min-h-screen bg-[#0a0c10] text-slate-100 p-8 pt-12">
            
            {/* 標題與儀表板主操作區 */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="text-[#63a6b0]" size={32} />
                            <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                                Strategic <span className="text-[#63a6b0]">Reconnaissance</span> Hub
                            </h1>
                        </div>
                        <p className="text-slate-400 font-medium tracking-tight">
                            5T 協議實時情資監測系統 | <span className="text-[#ffd700]">Decision-Ready Intelligence</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleManualIngest}
                            disabled={isIngesting}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full bg-[#63a6b0] text-white font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(99,166,176,0.3)] hover:shadow-[0_0_30px_rgba(99,166,176,0.5)] active:scale-95 ${isIngesting ? 'opacity-50' : ''}`}
                        >
                            <RefreshCw size={16} className={isIngesting ? 'animate-spin' : ''} />
                            {isIngesting ? 'Ingesting...' : 'Manual Ingest'}
                        </button>
                    </div>
                </div>

                {/* 分類過濾切換器 */}
                <div className="flex flex-wrap gap-3 mt-10">
                    <TabButton active={activeCategory === 'ALL'} onClick={() => setActiveCategory('ALL')} icon={<Layers size={14} />}>ALL NODES</TabButton>
                    <TabButton active={activeCategory === 'S1'} onClick={() => setActiveCategory('S1')} icon={<Globe size={14} />}>S1 Governance</TabButton>
                    <TabButton active={activeCategory === 'S2'} onClick={() => setActiveCategory('S2')} icon={<Landmark size={14} />}>S2 Standards</TabButton>
                    <TabButton active={activeCategory === 'S3'} onClick={() => setActiveCategory('S3')} icon={<BarChart3 size={14} />}>S3 Think Tanks</TabButton>
                    <TabButton active={activeCategory === 'S4'} onClick={() => setActiveCategory('S4')} icon={< Landmark size={14} />}>S4 Finance</TabButton>
                    <TabButton active={activeCategory === 'S5'} onClick={() => setActiveCategory('S5')} icon={<Cpu size={14} />}>S5 Tech</TabButton>
                </div>
            </div>

            {/* 情報卡網格 */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredIntel.length > 0 ? (
                    filteredIntel.map((intel) => (
                        <IntelCard5T key={intel.uuid} intel={intel} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-slate-500 font-mono tracking-widest uppercase text-sm">Waiting for strategic signals...</p>
                    </div>
                )}
            </div>

            {/* 側邊裝飾與狀態 */}
            <div className="fixed bottom-8 right-8 flex flex-col items-end gap-2 opacity-50 pointer-events-none">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono tracking-tighter">NCBDB_CONNECTED</span>
                </div>
                <div className="text-[10px] font-mono tracking-tighter">GATEWAY_VERSION: 2.0.0-PRO</div>
            </div>
        </div>
    );
}

const TabButton = ({ children, active, onClick, icon }: { children: React.ReactNode, active: boolean, onClick: () => void, icon?: React.ReactNode }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all border ${active ? 'bg-white/10 border-white/20 text-white shadow-lg' : 'bg-transparent border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'}`}
    >
        {icon}
        {children}
    </button>
);
