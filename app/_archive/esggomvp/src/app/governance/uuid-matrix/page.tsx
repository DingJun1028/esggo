'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Fingerprint,
    ShieldCheck,
    Search,
    Database,
    Zap,
    Link,
    Settings,
    Layers,
    Activity,
    Lock,
    Eye
} from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';

/**
 * 🏛️ Universal UUID Function Matrix (ESG GO! Edition)
 * ===================================================
 * 
 * This page serves as a system-wide reference for the 24 MECE services, 
 * their UUID Asset Tags, and 5T Compliance Gates.
 * 
 * Version: 1.6.0 (Alpha Sync)
 */

interface MatrixItem {
    id: string;
    category: string;
    name: string;
    assetTag: string;
    gate: string;
    definition: string;
    icon: React.ElementType;
}

const matrixData: MatrixItem[] = [
    // 1. Cognitive
    { id: "1.1", category: "認知智能 (Cognitive)", name: "個人 ESG 儀表板", assetTag: "Identity_Profile", gate: "Tangible (感知)", icon: Fingerprint, definition: "用戶數位分身之初次共鳴點，記錄主體覺醒數據。" },
    { id: "1.2", category: "認知智能 (Cognitive)", name: "AI 策略中心", assetTag: "Intelligence_Core", gate: "Transparent (驗算)", icon: Zap, definition: "決策權重之邏輯封裝，將 AI 洞察轉化為可回測之智力資產。" },
    { id: "1.3", category: "認知智能 (Cognitive)", name: "每日 ESG 簡報", assetTag: "Note_Daily", gate: "Trackable (追蹤)", icon: Activity, definition: "外部環境波動之時空錨點，形成個人連續性知識脈絡。" },
    { id: "1.4", category: "認知智能 (Cognitive)", name: "ESG 智能助手", assetTag: "Knowledge_Atom", gate: "Traceable (溯源)", icon: Eye, definition: "智慧對話之精確索引，連結至永恆知識牆之原始文獻。" },
    { id: "1.5", category: "認知智能 (Cognitive)", name: "趨勢預測引擎", assetTag: "Gnosis_Prediction", gate: "Transparent (公式)", icon: Search, definition: "未來概率之數學建模，將可能性鎖定為預測性數位資產。" },

    // 2. Excellence
    { id: "2.1", category: "卓越永續 (Excellence)", name: "企業健康檢查", assetTag: "Audit_Certificate", gate: "Trustworthy (誠信)", icon: ShieldCheck, definition: "組織治理之數位體檢證明，具備最高等級誠信封印。" },
    { id: "2.2", category: "卓越永續 (Excellence)", name: "碳盤存管理", assetTag: "Climate_Inventory", gate: "Transparent (驗算)", icon: Database, definition: "Scope 1-3 排放量之物理真實數據，附帶計算公式鏈。" },
    { id: "2.3", category: "卓越永續 (Excellence)", name: "影響修復實驗室", assetTag: "Process_Healing", gate: "Trackable (日誌)", icon: Activity, definition: "環境治理之生命週期記錄，追蹤受損系統之復原路徑。" },
    { id: "2.4", category: "卓越永續 (Excellence)", name: "永續轉型顧問", assetTag: "Contract_Transition", gate: "Traceable (決策)", icon: Link, definition: "商業模式重定義之合約副本，追溯企業轉型之關鍵因果。" },
    { id: "2.5", category: "卓越永續 (Excellence)", name: "綠色融資助手", assetTag: "Transaction_Asset", gate: "Trustworthy (防偽)", icon: Lock, definition: "永續資本之流動憑證，整合 5T 協議之金融信任單元。" },

    // 3. Governance
    { id: "3.1", category: "治理合規 (Governance)", name: "自動化報告生成", assetTag: "Report_Forge", gate: "Tangible (實體)", icon: Layers, definition: "符合國際標準之結構化報告，具備 5T 公證標章。" },
    { id: "3.2", category: "治理合規 (Governance)", name: "不可篡改證據庫", assetTag: "Vault_Evidence", gate: "Trustworthy (封印)", icon: Lock, definition: "SHA-256 鎖定之原始證據流，系統誠信之最終護坡。" },
    { id: "3.3", category: "治理合規 (Governance)", name: "誠信護照", assetTag: "Identity_Passport", gate: "Traceable (身分)", icon: Fingerprint, definition: "用戶於系統之跨域信任徽章，整合全週期行為溯源。" },
    { id: "3.4", category: "治理合規 (Governance)", name: "合規風險監控", assetTag: "Intelligence_Alert", gate: "Trackable (路徑)", icon: Activity, definition: "法規變動之動態回應日誌，確保合規狀態可即時回溯。" },
    { id: "3.5", category: "治理合規 (Governance)", name: "董事會儀表板", assetTag: "Decision_Center", gate: "Transparent (權限)", icon: Settings, definition: "高階治理之透明權力矩陣，記錄決策權重之公正分配。" },

    // 4. Agency
    { id: "4.1", category: "智能代理 (Agency)", name: "AI 代理鍛造廠", assetTag: "Satellite_Agent", gate: "Traceable (授權)", icon: Settings, definition: "自主代理之誕生證書，記錄其代理權力之來源與範圍。" },
    { id: "4.2", category: "智能代理 (Agency)", name: "任務矩陣", assetTag: "Process_Matrix", gate: "Trackable (狀態)", icon: Database, definition: "系統調度之熵值報告，追蹤任務從混沌到秩序之遷移。" },
    { id: "4.3", category: "智能代理 (Agency)", name: "智能工作流", assetTag: "Process_Flow", gate: "Transparent (效率)", icon: Zap, definition: "自動化流程之節能腳印，計算每一次自動化之減碳貢獻。" },
    { id: "4.4", category: "智能代理 (Agency)", name: "智能通知系統", assetTag: "Note_Alert", gate: "Tangible (反饋)", icon: Activity, definition: "用戶行為之即時感知回饋，將微觀互動資產化。" },
];

export default function UuidMatrixPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('ALL');

    const filteredData = matrixData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.assetTag.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'ALL' || item.category === activeTab;
        return matchesSearch && matchesTab;
    });

    const categories = ['ALL', ...Array.from(new Set(matrixData.map(item => item.category)))];

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 sm:p-12 font-sans selection:bg-[#63a6b0]/30">
            {/* Header Area */}
            <div className="max-w-7xl mx-auto mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-[#63a6b0]/20 text-[#63a6b0] text-[10px] font-black tracking-widest uppercase border border-[#63a6b0]/30 shadow-[0_0_15px_rgba(99,166,176,0.2)]">
                                System Protocol v1.6.0
                            </span>
                            <span className="flex h-2 w-2 rounded-full bg-[#63a6b0] animate-pulse" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic">
                            ESG GO! <span className="text-[#63a6b0]">UUID Matrix</span>
                        </h1>
                        <p className="text-white/50 max-w-2xl font-medium text-lg leading-relaxed">
                            本開發對照總表定義了平台 24 項 MECE 服務之資產屬性與 5T 協議合規關卡。<br />
                            遵循「服務即教學，知識即資產」之核心邏輯。
                        </p>
                    </div>

                    <div className="relative group w-full md:w-80">
                        <div className="absolute inset-0 bg-[#63a6b0]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-[#63a6b0]/50 transition-all backdrop-blur-xl">
                            <Search className="text-white/40 mr-3" size={20} />
                            <input
                                type="text"
                                placeholder="搜尋服務或資產標籤..."
                                className="bg-transparent border-none outline-none w-full text-sm font-medium placeholder:text-white/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Categories Tab */}
                <div className="flex flex-wrap gap-2 mt-12 border-b border-white/5 pb-6">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === cat
                                    ? 'bg-[#63a6b0] text-black shadow-[0_0_20px_rgba(99,166,176,0.4)]'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat === 'ALL' ? '全域檢視' : cat.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Area */}
            <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredData.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                            >
                                <LiquidGlassContainer
                                    glowColor="aqua"
                                    intensity="low"
                                    enablePerspective
                                    className="h-full border-white/10 hover:border-[#63a6b0]/40 group"
                                >
                                    <div className="flex flex-col h-full space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div className="p-3 rounded-2xl bg-white/5 text-[#63a6b0] group-hover:bg-[#63a6b0] group-hover:text-black transition-all duration-500 shadow-inner">
                                                <item.icon size={28} />
                                            </div>
                                            <span className="text-[10px] font-black text-white/20 font-mono tracking-tighter">
                                                #{item.id}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold mb-1 group-hover:text-[#63a6b0] transition-colors">{item.name}</h3>
                                            <p className="text-[10px] text-white/30 font-black tracking-widest uppercase">{item.category}</p>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Asset Tag</span>
                                                <code className="text-[#63a6b0] text-xs font-mono font-bold bg-[#63a6b0]/10 px-2 py-1 rounded-md border border-[#63a6b0]/20">
                                                    {item.assetTag}
                                                </code>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">5T Core Gate</span>
                                                <span className="text-white text-xs font-bold flex items-center gap-2">
                                                    <ShieldCheck size={14} className="text-emerald-500" />
                                                    {item.gate}
                                                </span>
                                            </div>

                                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                                <p className="text-xs text-white/60 leading-relaxed font-medium">
                                                    {item.definition}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </LiquidGlassContainer>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {filteredData.length === 0 && (
                    <div className="py-32 text-center text-white/20 font-bold tracking-widest">
                        NO ASSET MATCHED
                    </div>
                )}
            </div>

            {/* Footer Reference */}
            <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] text-white/20 font-black tracking-widest uppercase">
                <div className="flex items-center gap-8">
                    <span>© 2026 OMNI-ONE CORE</span>
                    <span>TRINITY UNIFIED RELEASE</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="w-12 h-[1px] bg-white/10" />
                    <span>TRANSCENDED, ETERNAL & NIRVANA</span>
                    <span className="w-12 h-[1px] bg-white/10" />
                </div>
            </div>
        </div>
    );
}
