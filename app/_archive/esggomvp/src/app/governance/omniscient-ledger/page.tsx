"use client";

import React, { useState } from "react";
import {
    Database,
    Eye,
    ShieldCheck,
    FileCheck,
    Lock,
    AlertTriangle,
    Fingerprint,
    CheckCircle2,
    FileText
} from "lucide-react";

/**
 * Omniscient Ledger & E-Seal System
 * 核心視角：將所有數據匯聚為「全知真理總表」，並在此進行三階層的「數位印信 (E-Seal)」簽核。
 * 簽核後數據將轉為「結霜固態 (Crystallized)」。
 */
export default function OmniscientLedgerPage() {
    // 模擬行資料 (包含不同來源與狀態)
    const [ledgerData, setLedgerData] = useState([
        {
            id: "esg-g-001",
            category: "Governance",
            indicator: "GRI 205: 反貪腐",
            value: "0 件",
            source: "AI 萃取 (PDF)",
            sourceHash: "0x8F2A...3B1C",
            confidence: 98,
            status: "approved", // crystallized
            approvals: { preparer: true, manager: true, cso: true }
        },
        {
            id: "esg-e-002",
            category: "Environment",
            indicator: "GRI 302: 能源消耗",
            value: "14,520 kWh",
            source: "AI 萃取 (電費單)",
            sourceHash: "0x9C4B...7E2A",
            confidence: 95,
            status: "pending_cso",
            approvals: { preparer: true, manager: true, cso: false }
        },
        {
            id: "esg-s-003",
            category: "Social",
            indicator: "GRI 401: 勞雇關係",
            value: "新進員工 45 人",
            source: "手動填報",
            sourceHash: null,
            confidence: 60,
            status: "pending_manager",
            approvals: { preparer: true, manager: false, cso: false },
            warning: "缺乏佐證文件"
        },
        {
            id: "esg-e-004",
            category: "Environment",
            indicator: "GRI 305: 溫室氣體",
            value: "420 tCO2e",
            source: "API 自動同步",
            sourceHash: "0x5E6F...7G8H",
            confidence: 99,
            status: "pending_cso",
            approvals: { preparer: true, manager: true, cso: false }
        }
    ]);

    const [signingId, setSigningId] = useState<string | null>(null);

    // 模擬簽核動作 (觸發 Hash Lock 結霜特效)
    const handleApprove = (id: string, role: 'preparer' | 'manager' | 'cso') => {
        setSigningId(id);

        // 模擬生物辨識延遲
        setTimeout(() => {
            setLedgerData(prev => prev.map(row => {
                if (row.id === id) {
                    const newApprovals = { ...row.approvals, [role]: true };
                    let newStatus = row.status;

                    if (newApprovals.cso) newStatus = "approved";
                    else if (newApprovals.manager) newStatus = "pending_cso";
                    else if (newApprovals.preparer) newStatus = "pending_manager";

                    return { ...row, approvals: newApprovals, status: newStatus };
                }
                return row;
            }));
            setSigningId(null);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-900 p-6 font-sans text-slate-300 selection:bg-[#63a6b0]/30 relative overflow-hidden">

            {/* 背景裝飾光暈 */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#63a6b0] blur-[150px] opacity-10 rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600 blur-[200px] opacity-10 rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* 頂部標題 */}
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Database className="w-8 h-8 text-[#ffd700]" />
                            全知真理總表
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">The Omniscient Ledger & E-Seal Center</p>
                    </div>

                    <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700">
                        <button className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-medium shadow-sm">
                            待簽核 (Action Required)
                        </button>
                        <button className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">
                            已封存 (Vaulted)
                        </button>
                    </div>
                </header>

                {/* 總表網格 */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-slate-700/50">
                                    <th className="p-4 font-semibold text-slate-400 w-48">分類 / 指標</th>
                                    <th className="p-4 font-semibold text-slate-400 w-48">申報數值</th>
                                    <th className="p-4 font-semibold text-slate-400 min-w-[200px]">溯源證據 (Golden Thread)</th>
                                    <th className="p-4 font-semibold text-slate-400 text-center w-64">審批進度 (E-Seal)</th>
                                    <th className="p-4 font-semibold text-slate-400 text-center w-32">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledgerData.map((row) => {
                                    const isCrystallized = row.status === "approved";
                                    const isSigning = signingId === row.id;

                                    return (
                                        <tr
                                            key={row.id}
                                            className={`
                                border-b border-slate-700/50 transition-all duration-700
                                ${isCrystallized
                                                    ? 'bg-gradient-to-r from-transparent via-[#63a6b0]/5 to-transparent'
                                                    : 'hover:bg-slate-700/30'}
                      `}
                                        >
                                            <td className="p-4">
                                                <div className="font-medium text-slate-200">{row.indicator}</div>
                                                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{row.category}</div>
                                            </td>

                                            <td className="p-4">
                                                <div className={`font-mono text-lg ${isCrystallized ? 'text-[#63a6b0]' : 'text-slate-300'}`}>
                                                    {row.value}
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        {row.sourceHash ? (
                                                            <div className="p-1 px-2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs flex items-center gap-1 w-max">
                                                                <Bot className="w-3 h-3" /> {row.source}
                                                            </div>
                                                        ) : (
                                                            <div className="p-1 px-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-1 w-max">
                                                                <PenTool className="w-3 h-3" /> {row.source}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {row.sourceHash && (
                                                        <div className="text-xs font-mono text-slate-500 flex items-center gap-1 opacity-70">
                                                            <FileText className="w-3 h-3" /> Hash: {row.sourceHash}
                                                        </div>
                                                    )}

                                                    {row.warning && (
                                                        <div className="text-xs text-rose-400 flex items-center gap-1">
                                                            <AlertTriangle className="w-3 h-3" /> {row.warning}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* 3 級審核節點 */}
                                                    <ApprovalNode
                                                        role="PREPARER"
                                                        approved={row.approvals.preparer}
                                                        crystallized={isCrystallized}
                                                    />
                                                    <div className={`w-6 h-0.5 ${row.approvals.preparer ? 'bg-[#63a6b0]/50' : 'bg-slate-700'}`}></div>

                                                    <ApprovalNode
                                                        role="MANAGER"
                                                        approved={row.approvals.manager}
                                                        crystallized={isCrystallized}
                                                    />
                                                    <div className={`w-6 h-0.5 ${row.approvals.manager ? 'bg-[#63a6b0]/50' : 'bg-slate-700'}`}></div>

                                                    <ApprovalNode
                                                        role="CSO"
                                                        approved={row.approvals.cso}
                                                        crystallized={isCrystallized}
                                                        isFinal
                                                    />
                                                </div>
                                            </td>

                                            <td className="p-4 text-center relative">
                                                {isCrystallized ? (
                                                    <div className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-800 text-[#ffd700] border border-[#ffd700]/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                                                        <Lock className="w-5 h-5" />
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleApprove(row.id, row.approvals.manager ? 'cso' : (row.approvals.preparer ? 'manager' : 'preparer'))}
                                                        disabled={isSigning}
                                                        className={`
                    relative overflow-hidden inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${isSigning ? 'bg-[#63a6b0] text-white scale-95' : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white border border-slate-600'}
                            `}
                                                    >
                                                        {isSigning ? (
                                                            <Fingerprint className="w-5 h-5 animate-pulse" />
                                                        ) : (
                                                            <>
                                                                <Fingerprint className="w-4 h-4 mr-2" />
                                                                蓋章
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody >
                        </table >
                    </div >

                    {/* 底部功能區 */}
                    < div className="p-4 bg-slate-900/80 border-t border-slate-700/50 flex justify-between items-center text-sm" >
                        <div className="text-slate-400 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            所有 Hash Records 均存放於 Immutable Ledger
                        </div>

                        <button className="text-[#63a6b0] hover:text-white transition-colors flex items-center gap-2">
                            <Eye className="w-4 h-4" /> 檢視完整盤查軌跡
                        </button>
                    </div >
                </div >

            </div >
        </div >
    );
}

// 審批節點組件
function ApprovalNode({ role, approved, crystallized, isFinal = false }: { role: string, approved: boolean, crystallized: boolean, isFinal?: boolean }) {
    if (crystallized) {
        // 結霜固化狀態 (Crystallized)
        return (
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-[#63a6b0]/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,166,176,0.3)] relative group cursor-default">
                <CheckCircle2 className="w-5 h-5 text-[#63a6b0]" />
                {/* 結霜特效疊加層 */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/ice-age.png')] opacity-30 mix-blend-screen pointer-events-none rounded-full"></div>

                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs bg-slate-900 text-slate-300 px-2 py-1 rounded w-max border border-slate-700 pointer-events-none z-10">
                    {role} 已簽署
                </div>
            </div>
        );
    }

    if (approved) {
        return (
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center relative group">
                <FileCheck className="w-4 h-4 text-slate-300" />
                <div className="absolute w-2 h-2 bg-emerald-500 rounded-full -top-1 -right-1 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs bg-slate-900 text-slate-300 px-2 py-1 rounded w-max border border-slate-700 pointer-events-none z-10">
                    {role} 已核件
                </div>
            </div>
        );
    }

    return (
        <div className="w-10 h-10 rounded-full bg-slate-900 border border-dashed border-slate-600 flex items-center justify-center relative group">
            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs bg-slate-900 text-slate-300 px-2 py-1 rounded w-max border border-slate-700 pointer-events-none z-10">
                等待 {role} 簽署
            </div>
        </div>
    );
}

function PenTool(props: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19 7-7 3 3-7 7-3-3z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="m2 2 7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>
}

// Ensure Bot is defined if used
function Bot(props: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
}
