import React from 'react';
import { getOmniTableServerClient } from '@/lib/omni-table/client';
import { revalidatePath } from 'next/cache';
import { CheckCircle2, RefreshCw } from 'lucide-react';

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

        const rawRecords = await (client.getRecords ? client.getRecords(datasheetId) : (client as any).listRecords(datasheetId));

        tasks = rawRecords.map((r: any) => ({
            id: r.recordId || r.id || Math.random().toString(),
            title: r.fields['Task Title'] || '未命名任務',
            status: r.fields['Status'] || 'Todo',
            assignee: r.fields['Assignee'] || null,
        }));

        tasks = tasks.reverse();
    } catch (err: any) {
        error = err.message || '無法連接至萬能筆記 OmniTable 節點';
    }


    return (
        <div className="w-full max-w-4xl mx-auto rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)]/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-slower">
            {/* 標頭區塊 */}
            <div className="mb-6 flex items-center justify-between border-b border-[var(--theme-border)]/30 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--theme-primary)]/20 text-[var(--theme-primary)]">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-wider text-[var(--theme-text)]">全通之心顯化：萬能筆記追蹤</h2>
                        <p className="text-sm text-[var(--theme-text-muted)]">OmniCore 自主衍生的治癒與治理足跡</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <form action={handleRefresh}>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-xs font-mono text-[var(--theme-text-muted)] hover:bg-[var(--theme-primary)]/20 hover:text-[var(--theme-primary)] hover:border-[var(--theme-primary)]/50 transition-all cursor-pointer shadow-sm active:scale-95"
                            title="強制重新共鳴 (Refresh)"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            REFRESH
                        </button>
                    </form>
                    <div className="text-xs font-mono text-emerald-400 animate-pulse flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </span>
                        圓通無礙 (SYNCED)
                    </div>
                </div>
            </div>

            {/* 錯誤處理 */}
            {error && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-4 text-sm text-rose-400">
                    ⚠️ 系統共鳴中斷：{error}
                </div>
            )}

            {/* 任務列表 */}
            {!error && tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-[var(--theme-text-muted)]">
                    <CheckCircle2 className="h-12 w-12 opacity-20 mb-3" />
                    <p>目前尚無系統衍生任務，萬能心核運行處於最佳熵減狀態。</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="group flex items-center justify-between rounded-xl border border-[var(--theme-border)]/30 bg-[var(--theme-surface)]/30 p-4 transition-all hover:bg-[var(--theme-surface)]/50 hover:border-[var(--theme-primary)]/30"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-[var(--theme-text)] group-hover:text-[var(--theme-primary)] transition-colors">
                                    {task.title}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-[var(--theme-text-muted)]">ID: {task.id}</span>
                                    {/* 顯示被指派的 Agent 標籤 */}
                                    {task.assignee && (
                                        <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono font-medium border border-[var(--theme-primary)]/30 bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
                                            <CheckCircle2 className="w-3 h-3" />
                                            {task.assignee}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Agent 指派操作表單 */}
                                {!task.assignee && task.status !== 'Done' && (
                                    <form action={assignTaskToAgent.bind(null, task.id)} className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <select name="agentId" required className="appearance-none bg-black/40 border border-[var(--theme-border)] text-[10px] font-mono text-slate-300 py-1 pl-2 pr-5 rounded focus:border-[var(--theme-primary)]/50 focus:outline-none cursor-pointer transition-colors">
                                            <option value="">[Assign Agent]</option>
                                            <option value="OmniCore">OmniCore Master</option>
                                            <option value="HealingGuardian">HealingGuardian</option>
                                            <option value="ZKP-Engine">ZKP Engine</option>
                                            <option value="Hermes">Hermes Email</option>
                                            <option value="Swarm-Env">Swarm (Env)</option>
                                        </select>
                                        <button
                                            type="submit"
                                            className="p-1 rounded bg-[var(--theme-surface)]/30 border border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm active:scale-95"
                                            title="確認指派"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </button>
                                    </form>
                                )}

                                {/* 狀態標籤 */}
                                <span className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold font-mono border ${task.status === 'Done' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                                    task.status === 'In Progress' ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400' :
                                        'border-amber-500/30 bg-amber-500/10 text-amber-400'
                                    }`}>
                                    {task.status === 'Done' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>}
                                    {task.status === 'In Progress' && <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse"></span>}
                                    {task.status === 'Todo' && <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>}
                                    {task.status.toUpperCase()}
                                </span>

                                {/* 癒合 (Mark as Done) 按鈕 */}
                                {task.status !== 'Done' && (
                                    <form action={markTaskAsDone.bind(null, task.id)}>
                                        <button
                                            type="submit"
                                            className="p-1.5 rounded-full bg-[var(--theme-surface)]/30 border border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm active:scale-95"
                                            title="標記為已癒合 (Done)"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
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
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}