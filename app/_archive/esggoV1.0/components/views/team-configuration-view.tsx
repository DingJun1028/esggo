import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Database, Cpu } from "lucide-react";

export type SquadRole = "ADMIN" | "REVIEWER" | "MEMBER" | "EXECUTOR" | "EXPERT";

export interface SquadMember {
    id: string;
    name: string;
    role: SquadRole;
    skills: string[];
    isActive: boolean;
    currentWorkload?: number;
    expertModule?: string;
    aiModel?: string;
}

interface TeamConfigurationViewProps {
    members?: SquadMember[];
    onSave?: (members: SquadMember[]) => Promise<void>;
}

export const TeamConfigurationView: React.FC<TeamConfigurationViewProps> = ({
    members: initialMembers,
    onSave
}) => {
    const [members, setMembers] = useState<SquadMember[]>(initialMembers || []);
    const [isLoading, setIsLoading] = useState(!initialMembers);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialMembers) {
            setMembers(initialMembers);
            setIsLoading(false);
        }
    }, [initialMembers]);

    const [newMemberName, setNewMemberName] = useState("");
    const [newMemberRole, setNewMemberRole] = useState<SquadRole>("MEMBER");
    const [newMemberSkill, setNewMemberSkill] = useState("");
    const [newMemberModule, setNewMemberModule] = useState("GRI_Core");
    const [newMemberModel, setNewMemberModel] = useState("Gemini 1.5 Pro");

    // 初始化載入小隊資料
    useEffect(() => {
        if (!initialMembers) {
            fetch("/api/squad")
                .then(res => res.json())
                .then(data => {
                    if (data.success) setMembers(data.members);
                })
                .catch(err => console.error("Failed to load squad:", err))
                .finally(() => setIsLoading(false));
        }
    }, [initialMembers]);

    // 儲存配置至資料庫
    const handleSaveConfiguration = async () => {
        setIsSaving(true);
        try {
            if (onSave) {
                await onSave(members);
                toast.success("小隊配置已成功同步！");
            } else {
                const res = await fetch("/api/squad", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ members }),
                });
                const data = await res.json();
                if (data.success) {
                    toast.success("小隊配置已成功儲存至資料庫！");
                } else {
                    toast.error(data.error || "儲存失敗");
                }
            }
        } catch (error) {
            toast.error("網路連線錯誤，無法儲存");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemberName.trim()) return;

        const newMember: SquadMember = {
            id: `u-${Date.now().toString().slice(-4)}`,
            name: newMemberName,
            role: newMemberRole,
            skills: newMemberSkill ? newMemberSkill.split(",").map(s => s.trim()) : [],
            isActive: true,
            expertModule: newMemberModule,
            aiModel: newMemberModel,
        };

        setMembers((prev) => [...prev, newMember]);
        setNewMemberName("");
        setNewMemberSkill("");
        setNewMemberRole("MEMBER");
        setNewMemberModule("GRI_Core");
    };

    const handleRemoveMember = (id: string) => {
        setMembers((prev) => prev.filter((m) => m.id !== id));
    };

    const toggleMemberStatus = (id: string) => {
        setMembers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
        );
    };

    if (isLoading) {
        return <div className="p-10 text-center text-stitch-muted font-bold text-sm tracking-widest uppercase">載入小隊資料中...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-8 space-y-10 bg-white min-h-[80vh] rounded-[40px] border border-stitch-border shadow-minimal mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-stitch-border pb-6 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-stitch-text tracking-tighter uppercase font-headline">ADK 小隊配置中心</h1>
                    <p className="text-stitch-muted mt-2 font-medium text-sm">管理團隊成員、角色權限與技能矩陣，為自主代行計畫建立基礎。</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-stitch-teal-start/10 text-stitch-teal-start px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-stitch-teal-start/20">
                        活躍人數: {(members || []).filter(m => m.isActive).length} 人
                    </div>
                    <button
                        onClick={handleSaveConfiguration}
                        disabled={isSaving}
                        className="bg-stitch-text text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-minimal hover:bg-black disabled:opacity-50 transition-all"
                    >
                        {isSaving ? "儲存中..." : "儲存配置"}
                    </button>
                </div>
            </div>

            {/* 新增成員表單 */}
            <div className="bg-stitch-shallow-gray/50 p-8 rounded-[24px] border border-stitch-border">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-sm font-black text-stitch-text uppercase tracking-widest">招募成員與綁定專家模組 (Recruit Expert)</h2>
                </div>

                {/* 快速模板 Quick Presets */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[10px] text-stitch-muted font-bold self-center uppercase tracking-widest mr-2">快速部署模板:</span>
                    {[
                        { name: "VeriBot", role: "EXPERT" as SquadRole, skills: "溫室氣體盤查, ISO 14064, 數據校驗", expertModule: "Carbon_Audit", aiModel: "Gemini 1.5 Pro" },
                        { name: "GapAnalyzer", role: "REVIEWER" as SquadRole, skills: "GRI 準則對接, 重大性分析, 差異比對", expertModule: "GRI_Core", aiModel: "Gemini 1.5 Flash" },
                        { name: "SupplyChain Oracle", role: "EXPERT" as SquadRole, skills: "Scope 3 計算, LCA 生命週期, 供應商管理", expertModule: "Supply_Chain", aiModel: "Gemini 1.5 Pro" },
                        { name: "Privacy Shield", role: "EXPERT" as SquadRole, skills: "ZKP 零知識證明, 薪資脫敏, GDPR 合規", expertModule: "ZKP_Privacy", aiModel: "Gemma 2 (Local)" }
                    ].map(preset => (
                        <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                                setNewMemberName(preset.name);
                                setNewMemberRole(preset.role);
                                setNewMemberSkill(preset.skills);
                                setNewMemberModule(preset.expertModule);
                                setNewMemberModel(preset.aiModel);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-stitch-border bg-white text-[10px] font-bold text-stitch-text hover:bg-stitch-teal-start hover:text-white hover:border-stitch-teal-start transition-colors shadow-minimal"
                        >
                            + {preset.name}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stitch-muted">成員名稱</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-stitch-border bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-stitch-teal-start/20 focus:border-stitch-teal-start outline-none transition-all placeholder:text-stitch-muted/50 shadow-minimal"
                            placeholder="例如: Charlie"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stitch-muted">小隊角色</label>
                        <select
                            className="w-full border border-stitch-border bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-stitch-teal-start/20 focus:border-stitch-teal-start outline-none transition-all shadow-minimal"
                            value={newMemberRole}
                            onChange={(e) => setNewMemberRole(e.target.value as SquadRole)}
                        >
                            <option value="ADMIN">管理員 (ADMIN)</option>
                            <option value="REVIEWER">審核者 (REVIEWER)</option>
                            <option value="EXECUTOR">執行者 (EXECUTOR)</option>
                            <option value="MEMBER">一般成員 (MEMBER)</option>
                            <option value="EXPERT">專家 AI (EXPERT)</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stitch-muted">專業技能 (用逗號分隔)</label>
                        <input
                            type="text"
                            className="w-full border border-stitch-border bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-stitch-teal-start/20 focus:border-stitch-teal-start outline-none transition-all placeholder:text-stitch-muted/50 shadow-minimal"
                            placeholder="例如: UI/UX, Node.js"
                            value={newMemberSkill}
                            onChange={(e) => setNewMemberSkill(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stitch-muted">掛載專家模組</label>
                        <select
                            className="w-full border border-stitch-border bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-stitch-teal-start/20 focus:border-stitch-teal-start outline-none transition-all shadow-minimal"
                            value={newMemberModule}
                            onChange={(e) => setNewMemberModule(e.target.value)}
                        >
                            <option value="GRI_Core">GRI 合規矩陣模組</option>
                            <option value="Carbon_Audit">溫室氣體盤查模組</option>
                            <option value="Supply_Chain">供應鏈追蹤模組</option>
                            <option value="ZKP_Privacy">ZKP 隱私封裝模組</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stitch-muted">驅動核心模型 (AI Model)</label>
                        <select
                            className="w-full border border-stitch-border bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-stitch-teal-start/20 focus:border-stitch-teal-start outline-none transition-all shadow-minimal"
                            value={newMemberModel}
                            onChange={(e) => setNewMemberModel(e.target.value)}
                        >
                            <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                            <option value="Gemini 1.5 Flash">Gemini 1.5 Flash</option>
                            <option value="Gemma 2 (Local)">Gemma 2 (端側運行)</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-stitch-text text-white rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors h-[46px] shadow-minimal group"
                    >
                        + 部署這名節點 <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </form>
            </div>

            {/* 成員列表清單 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {(members || []).map((member) => (
                    <div key={member.id} className={`p-6 flex flex-col rounded-[24px] border transition-all hover:shadow-md ${member.isActive ? 'bg-white shadow-minimal border-stitch-border' : 'bg-stitch-shallow-gray border-stitch-border opacity-60 hover:opacity-100'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-black text-xl text-stitch-text tracking-tight uppercase flex items-center gap-2">
                                    {member.name}
                                    {member.role === 'EXPERT' && <span className="bg-amber-100 text-amber-700 text-[8px] px-1.5 py-0.5 rounded uppercase tracking-widest">AI</span>}
                                </h3>
                                <span className={`inline-block mt-2 px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest ${member.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : member.role === 'REVIEWER' ? 'bg-amber-100 text-amber-700' : member.role === 'EXPERT' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-stitch-teal-start/10 text-stitch-teal-start'}`}>
                                    {member.role}
                                </span>
                            </div>
                            <button onClick={() => handleRemoveMember(member.id)} className="text-stitch-muted hover:text-stitch-critical transition-colors text-xs font-bold uppercase tracking-widest p-1">
                                移除
                            </button>
                        </div>

                        <div className="mt-4 flex-grow">
                            <div className="flex flex-wrap gap-2">
                                {member.skills.map((skill, idx) => (
                                    <span key={idx} className="bg-stitch-shallow-gray text-stitch-text px-2.5 py-1 rounded-md text-[10px] font-bold border border-stitch-border hover:bg-stone-100 cursor-default transition-colors">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {(member.expertModule || member.aiModel) && (
                            <div className="mt-5 pt-4 border-t border-stitch-border/50 flex flex-col gap-2">
                                {member.expertModule && (
                                    <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-stitch-muted">
                                        <div className="flex items-center gap-2"><Database className="w-3 h-3 text-stitch-teal-start" /> 領域模組</div>
                                        <span className="text-stitch-text bg-stitch-teal-start/5 px-2 py-0.5 rounded">{member.expertModule.replace("_", " ")}</span>
                                    </div>
                                )}
                                {member.aiModel && (
                                    <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-stitch-muted">
                                        <div className="flex items-center gap-2"><Cpu className="w-3 h-3 text-stitch-teal-start" /> 驅動模型</div>
                                        <span className="text-stitch-text bg-stitch-teal-start/5 px-2 py-0.5 rounded">{member.aiModel}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-5 pt-4 border-t border-stitch-border">
                            {/* Workload Indicator */}
                            {member.isActive && (
                                <div className="mb-4 group cursor-help">
                                    <div className="flex justify-between items-center mb-1 text-[9px] font-bold uppercase tracking-widest text-stitch-muted group-hover:text-stitch-text transition-colors">
                                        <span>任務負載 (Workload)</span>
                                        <span className={`${(member.currentWorkload || 0) > 80 ? 'text-stitch-critical' : 'text-stitch-teal-start'}`}>
                                            {member.currentWorkload || 0}%
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-stitch-border/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${(member.currentWorkload || 0) > 80 ? 'bg-stitch-critical' : 'bg-stitch-teal-start'}`}
                                            style={{ width: `${member.currentWorkload || 0}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center mt-2">
                                <span className="text-[10px] font-mono text-stitch-muted/70">ID: {member.id}</span>
                                <button onClick={() => toggleMemberStatus(member.id)} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all hover:scale-105 active:scale-95 ${member.isActive ? 'bg-stitch-optimal/10 text-stitch-optimal shadow-sm' : 'bg-stone-200 text-stone-500'}`}>
                                    {member.isActive ? "● ACTIVE" : "○ STANDBY"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};