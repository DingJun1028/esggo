"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Bot, Wand2, Info, UserCheck, AlertTriangle } from "lucide-react";
import { SquadMember } from "./team-configuration-view";

// 假設的 Task 型別
export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    assigneeId: string | null;
}

// 用來儲存 AI 判斷結果的介面
interface AiInsight {
    reason: string;
    confidenceScore: number;
    assignedMemberId: string;
}

interface TaskAssignmentBoardProps {
    tasks: Task[];
    teamMembers: SquadMember[];
    onAssignTask: (taskId: string, memberId: string, aiReason?: string) => void;
}

export const TaskAssignmentBoard: React.FC<TaskAssignmentBoardProps> = ({
    tasks,
    teamMembers,
    onAssignTask,
}) => {
    // 記錄正在進行 AI 派單的任務 ID
    const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
    // 記錄每個任務的 AI 判斷邏輯
    const [aiInsights, setAiInsights] = useState<Record<string, AiInsight>>({});

    // 只顯示尚未派單的任務
    const unassignedTasks = (tasks || []).filter((t) => t.status === "TODO" && !t.assigneeId);

    const handleConfirmAi = (task: Task) => {
        const insight = aiInsights[task.id];
        if (insight) {
            // 呼叫父層分派方法，並將 AI 的判斷邏輯 (reason) 一併往後端送
            onAssignTask(task.id, insight.assignedMemberId, insight.reason);
            setAiInsights((prev) => {
                const newState = { ...prev };
                delete newState[task.id];
                return newState;
            });
        }
    };

    const handleCancelAi = (taskId: string) => {
        setAiInsights((prev) => {
            const newState = { ...prev };
            delete newState[taskId];
            return newState;
        });
        toast.info("已取消 AI 派單建議");
    };

    const handleAutoAssign = async (task: Task) => {
        setLoadingTaskId(task.id);
        try {
            const res = await fetch("/api/squad/auto-assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task, members: teamMembers }),
            });

            const data = await res.json();

            if (data.success) {
                const { assignedMemberId, reason, confidenceScore } = data.assignment;

                // 1. 將 AI 判斷邏輯存入狀態，以便在 UI 顯示
                setAiInsights((prev) => ({
                    ...prev,
                    [task.id]: { assignedMemberId, reason, confidenceScore },
                }));

                toast.success("AI 已提供派單建議，請主管審閱");
            } else {
                toast.error(`AI 派單失敗: ${data.error}`);
            }
        } catch (error) {
            toast.error("網路連線錯誤，無法呼叫 AI 派單系統");
        } finally {
            setLoadingTaskId(null);
        }
    };

    return (
        <div className="p-8 bg-white rounded-[32px] shadow-minimal border border-stitch-border max-w-5xl mx-auto space-y-8 mt-6">
            <div className="flex items-center gap-4 border-b border-stitch-border pb-6">
                <div className="w-14 h-14 rounded-2xl bg-stitch-teal-start/10 text-stitch-teal-start flex items-center justify-center">
                    <UserCheck className="w-7 h-7" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-stitch-text tracking-tighter uppercase font-headline">任務分派中心</h2>
                    <p className="text-sm font-bold text-stitch-muted uppercase tracking-widest mt-1">手動指派，或使用 AI 根據技能自動匹配人選。</p>
                </div>
            </div>

            <div className="space-y-6">
                {unassignedTasks.length === 0 ? (
                    <div className="text-center py-16 bg-stitch-shallow-gray/50 rounded-2xl border-2 border-dashed border-stitch-border text-stitch-muted font-bold text-sm uppercase tracking-widest">
                        目前沒有待分派的任務 🎉
                    </div>
                ) : (
                    unassignedTasks.map((task) => (
                        <div key={task.id} className="border border-stitch-border p-6 rounded-[24px] flex flex-col gap-5 shadow-minimal hover:border-stitch-teal-start/30 hover:shadow-md transition-all bg-white">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <h3 className="font-black text-xl text-stitch-text">{task.title}</h3>
                                    <p className="text-sm font-medium text-stitch-muted mt-2">{task.description}</p>
                                </div>
                                {(() => {
                                    const insight = aiInsights[task.id];
                                    if (insight) {
                                        return (
                                            <div className="flex items-center gap-3 shrink-0">
                                                <button
                                                    onClick={() => handleCancelAi(task.id)}
                                                    className="px-5 py-3 bg-stitch-shallow-gray text-stitch-muted rounded-xl text-xs font-black hover:bg-stone-200 uppercase tracking-widest transition-all"
                                                >
                                                    取消建議
                                                </button>
                                                <button
                                                    onClick={() => handleConfirmAi(task)}
                                                    disabled={insight.confidenceScore < 50}
                                                    className={`px-6 py-3 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-minimal transition-all ${insight.confidenceScore < 50 ? 'bg-stone-300 cursor-not-allowed' : 'bg-stitch-optimal hover:brightness-110'}`}
                                                >
                                                    {insight.confidenceScore < 50
                                                        ? "信心過低，請手動派單"
                                                        : `確認指派 (${(teamMembers || []).find(m => m.id === insight.assignedMemberId)?.name || "此成員"} - 負載: ${(teamMembers || []).find(m => m.id === insight.assignedMemberId)?.currentWorkload || 0})`}
                                                </button>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div className="flex items-center gap-3 shrink-0">
                                            {/* 手動派單下拉選單 */}
                                            <select
                                                className="border border-stitch-border bg-stitch-shallow-gray/50 rounded-xl p-3 text-sm font-bold text-stitch-text outline-none focus:ring-2 focus:ring-stitch-teal-start/20 focus:border-stitch-teal-start transition-all"
                                                onChange={(e) => onAssignTask(task.id, e.target.value)}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>選擇分派成員...</option>
                                                {(teamMembers || []).map((member) => (
                                                    <option key={member.id} value={member.id}>
                                                        {member.name} ({member.role}) - 負載: {member.currentWorkload || 0}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* AI 智能派單按鈕 */}
                                            <button
                                                onClick={() => handleAutoAssign(task)}
                                                disabled={loadingTaskId === task.id}
                                                className="flex items-center gap-2 bg-stitch-text text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-minimal hover:bg-black disabled:opacity-50 transition-all"
                                            >
                                                {loadingTaskId === task.id ? <Wand2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                                                {loadingTaskId === task.id ? "分析中..." : "AI 智能派單"}
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* 如果 AI 有回傳建議，在這裡顯示判斷邏輯供主管參考 */}
                            {(() => {
                                const insight = aiInsights[task.id];
                                if (!insight) return null;

                                return (
                                    <div className={`border rounded-[16px] p-5 flex gap-4 items-start mt-2 ${insight.confidenceScore < 50 ? 'bg-stitch-critical/5 border-stitch-critical/20' : 'bg-stitch-teal-start/5 border-stitch-teal-start/20'}`}>
                                        {insight.confidenceScore < 50 ? (
                                            <AlertTriangle className="w-5 h-5 text-stitch-critical shrink-0 mt-0.5" />
                                        ) : (
                                            <Info className="w-5 h-5 text-stitch-teal-start shrink-0 mt-0.5" />
                                        )}
                                        <div className="space-y-1">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${insight.confidenceScore < 50 ? 'text-stitch-critical' : 'text-stitch-teal-start'}`}>
                                                AI 判斷邏輯 (Confidence: {insight.confidenceScore}%)
                                                {insight.confidenceScore < 50 && " - 匹配度過低，系統已攔截"}
                                            </span>
                                            <p className={`text-sm leading-relaxed font-bold ${insight.confidenceScore < 50 ? 'text-stitch-critical/80' : 'text-stitch-teal-start/80'}`}>{insight.reason}</p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
