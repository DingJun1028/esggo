'use client';

/**
 * 💡 UI 組件：商業偵情中心 - 5T 戰略情報卡 (Bento Box 佈局)
 * 視覺：高密度、零幻覺、毛玻璃質感 (Liquid Glass)
 */
import React from 'react';
import { IIntelNode5T, RECON_TAXONOMY } from '../../../types/omni/recon.types';
import { ShieldCheck, Link, Activity, Eye, Lock, Zap } from 'lucide-react';

interface IntelCard5TProps {
    intel: IIntelNode5T;
    className?: string;
}

export const IntelCard5T: React.FC<IntelCard5TProps> = ({ intel, className = "" }) => {
    return (
        // 液態玻璃 (Liquid Glass) 底層：半透明背景 + 深度模糊 + 光影邊框
        <div className={`relative p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] font-sans overflow-hidden group hover:bg-white/10 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1 ${className}`}>
            
            {/* 動態 AURA 光影 */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#63a6b0]/10 rounded-full blur-[100px] group-hover:bg-[#63a6b0]/20 transition-all duration-700" />
            
            {/* 頂部：S1-S5 分類與 5T 狀態燈號 */}
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-gradient-to-r from-[#63a6b0]/20 to-[#63a6b0]/5 text-[#63a6b0] text-[10px] font-black rounded-lg border border-[#63a6b0]/20 tracking-tighter uppercase">
                        {intel.category} | {RECON_TAXONOMY[intel.category]}
                    </div>
                </div>
                
                {/* 4可 1不可 狀態指示燈 (5W1H 5T 協議) */}
                <div className="flex gap-2">
                    <StatusDot color="bg-emerald-500" label="Tangible" glow="[0_0_8px_#10b981]" icon={<Eye size={8} />} />
                    <StatusDot color="bg-emerald-500" label="Traceable" glow="[0_0_8px_#10b981]" icon={<Link size={8} />} />
                    <StatusDot color="bg-blue-500" label="Trackable" glow="[0_0_8px_#3b82f6]" icon={<Activity size={8} />} />
                    <StatusDot color="bg-orange-500" label="Transparent" glow="[0_0_8px_#f97316]" icon={<ShieldCheck size={8} />} />
                    <StatusDot color="bg-red-600" label="Trustworthy" glow="[0_0_12px_#dc2626]" animate icon={<Lock size={8} />} />
                </div>
            </div>

            {/* 核心情報內容 */}
            <div className="mb-6 relative z-10">
                <div className="flex items-start gap-2 mb-3">
                    <Zap size={16} className="text-[#ffd700] mt-1 shrink-0" />
                    <h3 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-[#63a6b0] transition-colors">{intel.payload.title}</h3>
                </div>
                
                <div className="relative">
                    <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-[#ffd700] to-transparent" />
                    <p className="text-sm text-slate-300 leading-relaxed pl-5 font-medium">
                        {intel.payload.decision_ready_insight}
                    </p>
                </div>
            </div>

            {/* 影響實體/區域 */}
            {intel.payload.entities && intel.payload.entities.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                    {intel.payload.entities.map(entity => (
                        <span key={entity} className="text-[9px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 font-mono tracking-tighter">
                            @{entity}
                        </span>
                    ))}
                </div>
            )}

            {/* 底部：驗算標籤與溯源證明 */}
            <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/5 relative z-10">
                <div className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-mono space-y-1">
                    <p className="flex items-center gap-1.5"><span className="text-[#63a6b0]">TRACE:</span> {intel.protocol_5T.traceable.slice(0, 40)}...</p>
                    <p className="flex items-center gap-1.5"><span className="text-orange-400">CALC:</span> {intel.protocol_5T.transparent}</p>
                </div>
                <div className="text-right">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-1">Fingerprint Sealed</span>
                        <span className="text-[10px] text-red-500/90 font-mono font-black tracking-widest bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10">
                            {intel.protocol_5T.trustworthy.substring(0, 16).toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 輔助組件：狀態燈
const StatusDot = ({ color, label, glow, animate = false, icon }: { color: string, label: string, glow: string, animate?: boolean, icon: React.ReactNode }) => (
    <div className="flex flex-col items-center gap-1 group/dot relative">
        <div className={`w-3 h-3 rounded-full ${color} shadow-${glow} flex items-center justify-center text-white/80 ${animate ? 'animate-pulse' : ''}`}>
            {icon}
        </div>
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[8px] rounded opacity-0 group-hover/dot:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
            {label}
        </span>
    </div>
);
