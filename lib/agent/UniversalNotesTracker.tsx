import React from 'react';
import { getOmniTableServerClient } from '@/lib/omni-table/client';
import { revalidatePath } from 'next/cache';

export { getUniversalNotesAction, semanticCreateTaskAction } from './UniversalNotesActions';
export type { TaskRecord } from './UniversalNotesActions';
import { TaskRecord, handleRefresh, markTaskAsDone, assignTaskToAgent } from './UniversalNotesActions';

/**
 * 🌌 Universal Notes Tracker
 * 萬能筆記 - 任務追蹤面板 (React Server Component)
 * 呈現「無作妙德圓通無礙」系統自發生長與自癒的足跡
 */
export default async function UniversalNotesTracker() {
    let tasks: TaskRecord[] = [];
    let error: string | null = null;

    try {
        const client = getOmniTableServerClient();
        const datasheetId = process.env.OMNITABLE_TASKS_DATASHEET_ID;

        if (!datasheetId) {
            throw new Error('請先於環境變數設定 OMNITABLE_TASKS_DATASHEET_ID');
        }

        // 假設底層 SDK 具備 getRecords 或 listRecords 方法
        // 根據系統腳本推測其 API 命名風格
        const rawRecords = await (client.getRecords ? client.getRecords(datasheetId) : (client as any).listRecords(datasheetId));

        tasks = rawRecords.map((r: any) => ({
            id: r.recordId || r.id || Math.random().toString(),
            title: r.fields['Task Title'] || '未命名任務',
            status: r.fields['Status'] || 'Todo',
            assignee: r.fields['Assignee'] || null,
        }));

        // 將最新任務排序於上方
        tasks = tasks.reverse();
    } catch (err: any) {
        error = err.message || '無法連接至萬能筆記 OmniTable 節點';
    }



    return (
        <div className="w-full max-w-4xl mx-auto rounded-2xl border border-cyan-glow/40 bg-void-rich/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-slower">
            {/* 標頭區塊 */}
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-core/20 text-cyan-core shadow-cyan-glow">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-wider text-surface-primary">全通之心顯化：萬能筆記追蹤</h2>
                        <p className="text-sm text-cyan-core/70">OmniCore 自主衍生的治癒與治理足跡</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <form action={handleRefresh}>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-mono text-surface-primary/70 hover:bg-cyan-core/20 hover:text-cyan-core hover:border-cyan-core/50 transition-all cursor-pointer shadow-sm active:scale-95"
                            title="強制重新共鳴 (Refresh)"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            REFRESH
                        </button>
                    </form>
                    <div className="text-xs font-mono text-emerald-soul/80 animate-pulse-slow flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-soul opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-soul"></span>
                        </span>
                        圓通無礙 (SYNCED)
                    </div>
                </div>
            </div>

            {/* 錯誤處理 */}
            {error && (
                <div className="rounded-lg bg-lethal/10 border border-lethal/20 p-4 text-sm text-lethal">
                    ⚠️ 系統共鳴中斷：{error}
                </div>
            )}

            {/* 任務列表 */}
            {!error && tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted">
                    <svg className="h-12 w-12 opacity-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>目前尚無系統衍生任務，萬能心核運行處於最佳熵減狀態。</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-cyan-glow/30"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-surface-primary group-hover:text-cyan-core transition-colors">
                                    {task.title}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-muted">ID: {task.id}</span>
                                    {/* 顯示被指派的 Agent 標籤 */}
                                    {task.assignee && (
                                        <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono font-medium border border-cyan-core/30 bg-cyan-core/10 text-cyan-core shadow-cyan-glow">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            {task.assignee}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Agent 指派操作表單 (若未指派且未完成，且在 hover 狀態下才顯示) */}
                                {!task.assignee && task.status !== 'Done' && (
                                    <form action={assignTaskToAgent.bind(null, task.id)} className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <select name="agentId" required className="appearance-none bg-black/40 border border-white/10 text-[10px] font-mono text-slate-300 py-1 pl-2 pr-5 rounded focus:border-cyan-core/50 focus:outline-none cursor-pointer transition-colors">
                                            <option value="">[Assign Agent]</option>
                                            <option value="OmniCore">OmniCore Master</option>
                                            <option value="HealingGuardian">HealingGuardian</option>
                                            <option value="ZKP-Engine">ZKP Engine</option>
                                            <option value="Hermes">Hermes Email</option>
                                            <option value="Swarm-Env">Swarm (Env)</option>
                                        </select>
                                        <button
                                            type="submit"
                                            className="p-1 rounded bg-white/5 border border-white/10 text-slate-400 hover:bg-cyan-core/20 hover:text-cyan-core hover:border-cyan-core/50 transition-all cursor-pointer shadow-sm active:scale-95"
                                            title="確認指派"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </button>
                                    </form>
                                )}

                                {/* 狀態標籤 */}
                                <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold font-mono border ${task.status === 'Done' ? 'border-emerald-soul/30 bg-emerald-soul/10 text-emerald-soul shadow-emerald-glow' :
                                    task.status === 'In Progress' ? 'border-cyan-core/30 bg-cyan-core/10 text-cyan-core shadow-cyan-glow' :
                                        'border-california-gold/30 bg-california-gold/10 text-california-gold'
                                    }`}>
                                    {task.status === 'Done' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-soul"></span>}
                                    {task.status === 'In Progress' && <span className="h-1.5 w-1.5 rounded-full bg-cyan-core animate-pulse"></span>}
                                    {task.status === 'Todo' && <span className="h-1.5 w-1.5 rounded-full bg-california-gold"></span>}
                                    {task.status.toUpperCase()}
                                </div>

                                {/* 癒合 (Mark as Done) 按鈕 */}
                                {task.status !== 'Done' && (
                                    <form action={markTaskAsDone.bind(null, task.id)}>
                                        <button
                                            type="submit"
                                            className="p-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:bg-emerald-soul/20 hover:text-emerald-soul hover:border-emerald-soul/50 transition-all cursor-pointer shadow-sm active:scale-95"
                                            title="標記為已癒合 (Done)"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}