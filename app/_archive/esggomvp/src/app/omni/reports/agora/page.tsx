'use client';

import React from 'react';
import { Globe, Send, ShieldCheck, History } from 'lucide-react';
import { OneClickReportBuilder } from '@/components/omni/agora/OneClickReportBuilder';
import { VerificationTimeline } from '@/components/omni/verification/VerificationTimeline';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { OmniComicStrip, ComicPanel } from '@/components/omni/cards/OmniComicStrip';

const comicPanels: [ComicPanel, ComicPanel, ComicPanel, ComicPanel] = [
    { id: '1', title: '時間軸驗證', description: '追溯報表的完整生命週期，從原始採集到 5T 驗證一目了然。', color: 'primary' },
    { id: '2', title: '一鍵鑄造', description: '將驗證完成的零幻覺敘事與數據，透過神經引擎鑄造為高價值報告。', color: 'accent' },
    { id: '3', title: '5T 數位簽章', description: '為報告蓋上專屬數位簽章，保障永續資產的不可篡改與權威性。', color: 'success' },
    { id: '4', title: '全域發布', description: '透過發布廣場(Agora)，將成果同步至官網、利害關係人與全球監管機構。', color: 'danger' }
];

/**
 * 🌐 Publication Agora Page (發布廣場)
 * 展示 Epic 5 的成果：一鍵報告鑄造與驗證時間軸。
 */
export default function PublicationAgoraPage() {
    const mockTimelineEvents = [
        {
            id: 'evt-1',
            type: 'collection' as const,
            label: '數據採集中心 (Tangible)',
            timestamp: '2026-03-01 10:00',
            description: '從 IoT 傳感器自動同步 Scope 2 用電數據。座標: [25.0, 121.5, 42]',
            actor: 'IoT_OMNI_NODE_A1',
            isCompleted: true
        },
        {
            id: 'evt-2',
            type: 'refinement' as const,
            label: '資料煉製所 (Traceable)',
            timestamp: '2026-03-02 14:30',
            description: '執行動態表單驗證，補全業務邊界。5T 原子化封裝。',
            actor: 'Dr._Thoth_Assistant',
            isCompleted: true
        },
        {
            id: 'evt-3',
            type: 'verification' as const,
            label: '驗算聖殿 (Transparent)',
            timestamp: '2026-03-03 09:15',
            description: '執行零幻覺驗算。公式映射對準時空相位 W: 1.00042',
            actor: 'Gnosis_Validator',
            isCompleted: true
        },
        {
            id: 'evt-4',
            type: 'sealing' as const,
            label: 'Hash Lock 封印 (Trustworthy)',
            timestamp: '2026-03-04 16:45',
            description: '封印數位資產：atom-dat-777888。琥珀鎖定 SHA-256。',
            actor: 'OmniPriest',
            isCompleted: true
        },
        {
            id: 'evt-5',
            type: 'publication' as const,
            label: '發布廣場 (Transcendent)',
            timestamp: 'Pending',
            description: '鑄造為正式永續報告。啟動多語系跨界發布。',
            actor: 'System_Agora',
            isCompleted: false
        }
    ];

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-12 bg-omni-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Globe size={28} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-[#1D1D1F]">發布廣場 <span className="text-omni-primary">(Agora)</span></h1>
                            <p className="text-omni-text-sub mt-2">將驗證過的永續資產，一鍵顯化為連結世界的報告成果。</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mb-6">
                <OmniComicStrip panels={comicPanels} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 左側：一鍵報告鑄造區 */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-black text-omni-text-main mb-6">
                            <Send size={20} className="text-omni-primary" /> 一鍵報告鑄造引擎
                        </h3>
                        <OneClickReportBuilder />
                    </section>

                    <div className="p-10 rounded-[40px] bg-[#1D1D1F] text-white flex items-center justify-between overflow-hidden relative group">
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="size-16 bg-white/10 rounded-3xl flex items-center justify-center text-omni-primary border border-white/10">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold">5T 資產認證保證</h4>
                                <p className="text-sm opacity-60 mt-1">所有自 Agora 發出的報告均具備 5T 數位簽章，支持即時溯源查驗。</p>
                            </div>
                        </div>
                        <button className="relative z-10 px-6 py-3 bg-omni-primary rounded-xl font-bold hover:scale-105 transition-all">下載手冊</button>
                        <ShieldCheck size={160} className="absolute -bottom-10 -right-10 opacity-5 outline-none pointer-events-none -rotate-12 transition-transform group-hover:scale-110" />
                    </div>
                </div>

                {/* 右側：資產溯源時間軸 */}
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="flex items-center gap-2 text-lg font-black text-omni-text-main">
                        <History size={20} className="text-omni-primary" /> 資產誠信路徑
                    </h3>
                    <LiquidGlassContainer className="p-6">
                        <VerificationTimeline events={mockTimelineEvents} />
                    </LiquidGlassContainer>
                </div>
            </div>
        </div>
    );
}
