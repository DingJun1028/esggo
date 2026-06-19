


import React, { useState, useMemo } from 'react';
import {
    ListTodo, Plus, Calendar, Tag, Trash2,
    CheckCircle, Clock, AlertTriangle, X, Loader2,
    ChevronRight, Layout, Info, Search, Filter,
    MapPin, Globe, Activity, ShieldCheck, Target,
    Send, BrainCircuit, Sparkles, FilterX, AlertCircle,
    Undo2, Link
} from 'lucide-react';
import { Language, TaskStatus, TaskPriority, AgentTask } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useCompany } from './providers/CompanyProvider';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { useToast } from '../contexts/ToastContext';
import { z } from 'zod';

const EARTHBONE_ZONES = [
    { id: 'tpe', name: 'Taipei HQ', region: 'APAC', color: 'text-cyan-400' },
    { id: 'ber', name: 'Berlin Plant', region: 'EMEA', color: 'text-emerald-400' },
    { id: 'aus', name: 'Austin R&D', region: 'NA', color: 'text-amber-400' },
    { id: 'hcm', name: 'Ho Chi Minh', region: 'APAC', color: 'text-rose-400' },
];

export const AgentTasks: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { addToast } = useToast();
    const { agentTasks, addAgentTask, updateAgentTaskStatus, deleteAgentTask } = useCompany();
    const { availablePersonas } = useUniversalAgent();

    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [taskDraft, setTaskDraft] = useState({
        title: '', description: '', assigneeId: availablePersonas[0]?.id || '',
        locationId: EARTHBONE_ZONES[0]!.id, dueDate: new Date().toISOString().split('T')[0], priority: TaskPriority.MEDIUM
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const taskSchema = useMemo(() => z.object({
        title: z.string().trim().min(3, isZh ? "標題太短" : "Title too short").max(100),
        description: z.string().trim().min(10, isZh ? "任務說明太短" : "Description too short"),
        dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, isZh ? "日期格式錯誤" : "Invalid date format"),
        priority: z.nativeEnum(TaskPriority)
    }), [isZh]);

    const filteredTasks = useMemo(() =>
        agentTasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())),
        [agentTasks, searchQuery]);

    const handleCreateTask = () => {
        setErrors({});
        const result = taskSchema.safeParse({
            title: taskDraft.title,
            description: taskDraft.description,
            dueDate: taskDraft.dueDate,
            priority: taskDraft.priority
        });

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach(err => {
                if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        addAgentTask({ ...taskDraft, dueDate: taskDraft.dueDate || '' });
        setIsAdding(false);
        setTaskDraft({ title: '', description: '', assigneeId: availablePersonas[0]?.id || '', locationId: EARTHBONE_ZONES[0]!.id, dueDate: new Date().toISOString().split('T')[0], priority: TaskPriority.MEDIUM });
        addToast('success', isZh ? '戰術指令已發送' : 'Directive Deployed', 'Orchestrator');
    };

    const handleToggleStatus = (id: string, currentStatus: TaskStatus) => {
        const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        updateAgentTaskStatus(id, nextStatus);

        if (nextStatus === 'PENDING') {
            addToast('info', isZh ? '任務已重置為待處理' : 'Task reset to pending.', 'System');
        } else {
            addToast('success', isZh ? '任務已標記為完成' : 'Task marked as completed.', 'System');
        }
    };

    return (
        <div className="h-full flex flex-col min-h-0 font-sans overflow-hidden">
            <UniversalPageHeader
                icon={Target}
                title={{ zh: '代理人戰術編排', en: 'Agent Orchestration' }}
                description={{ zh: '全球地景產區佈署：定義、指派與追蹤代理人任務', en: 'Global Earthbone Deployment: Define, assign & track agent tasks.' }}
                language={language}
                tag={{ zh: '編排核心 v1.0', en: 'TASK_KERNEL_v1.0' }}
            />

            <div className="flex-1 flex flex-col min-h-0 mt-4 space-y-4">
                {/* Search & Actions Bar */}
                <div className="flex justify-between items-center shrink-0">
                    <div className="relative w-80 group/search">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/search:text-celestial-gold transition-colors" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-xs text-white focus:border-celestial-gold outline-none transition-all placeholder:text-gray-700 uppercase font-black tracking-widest"
                            placeholder="SEARCH_TASKS..."
                        />
                    </div>
                    <button onClick={() => setIsAdding(true)} className="px-8 py-3.5 bg-celestial-gold text-black font-black rounded-2xl flex items-center gap-2 hover:scale-105 transition-all text-[11px] uppercase shadow-xl shadow-amber-500/20 active:scale-95">
                        <Plus className="w-5 h-5" /> CREATE_DIRECTIVE
                    </button>
                </div>

                <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden pb-4">
                    {/* Task Feed (8/12) */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0 glass-bento border-white/5 bg-slate-900/40 rounded-[3rem] p-1 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none"><BrainCircuit className="w-64 h-64 text-white" /></div>

                        <div className="p-8 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl flex justify-between items-center shrink-0 z-10 rounded-t-[3rem]">
                            <div className="flex items-center gap-3">
                                <ListTodo className="w-5 h-5 text-gray-500" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active_Task_Feed</span>
                            </div>
                            <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">{filteredTasks.length} NODES_SYNCED</div>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-3 z-10">
                            {filteredTasks.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 py-20">
                                    <FilterX className="w-20 h-20 mb-4" />
                                    <p className="zh-main text-lg uppercase tracking-widest">No Directives Identified</p>
                                </div>
                            ) : (
                                filteredTasks.map(task => (
                                    <div key={task.id} className="p-6 bg-black/60 border border-white/5 rounded-[2.2rem] hover:border-white/20 transition-all flex justify-between items-center group shadow-xl">
                                        <div className="flex items-center gap-6 min-w-0">
                                            <div className={`p-3.5 rounded-2xl border transition-all group-hover:scale-110 ${task.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-white/5 border-white/10 text-gray-700'}`}>
                                                {task.status === 'COMPLETED' ? <CheckCircle className="w-6 h-6" /> : <BrainCircuit className="w-6 h-6" />}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className={`zh-main text-lg truncate max-w-[250px] transition-colors ${task.status === 'COMPLETED' ? 'text-emerald-500 line-through opacity-50' : 'text-white group-hover:text-celestial-gold'}`}>{task.title}</h4>

                                                {/* Dependency Indicator */}
                                                {task.dependencies && task.dependencies.length > 0 && (
                                                    <div className="flex items-center gap-1.5 mt-1 mb-1">
                                                        <Link className="w-3 h-3 text-amber-500" />
                                                        <span className="text-[9px] font-mono text-amber-500/80 uppercase">
                                                            WAITING_ON: {agentTasks.find(t => t.id === task.dependencies![0])?.title.substring(0, 15)}...
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4 mt-1.5">
                                                    <div className="flex items-center gap-1.5 text-[8px] font-black text-gray-600 uppercase tracking-widest">
                                                        <Activity className="w-2.5 h-2.5" /> {task.status}
                                                    </div>
                                                    <div className="w-px h-2 bg-white/10" />
                                                    <div className="flex items-center gap-1.5 text-[8px] font-black text-gray-600 uppercase tracking-widest">
                                                        <Tag className="w-2.5 h-2.5" /> {task.priority}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8 shrink-0">
                                            <div className="text-right">
                                                <div className="text-[8px] text-gray-700 uppercase font-black mb-1">Due_Date</div>
                                                <div className="text-xs text-gray-500 font-mono tracking-tighter">{task.dueDate}</div>
                                            </div>
                                            <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleToggleStatus(task.id, task.status)}
                                                    className={`p-3 rounded-xl transition-all active:scale-90 border ${task.status === 'COMPLETED' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500 hover:text-black' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-black'}`}
                                                    title={task.status === 'COMPLETED' ? 'Uncheck Task' : 'Complete Task'}
                                                >
                                                    {task.status === 'COMPLETED' ? <Undo2 className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => deleteAgentTask(task.id)} className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 border border-rose-500/20 transition-all active:scale-90"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Zone Registry (4/12) */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                        <div className="glass-bento p-10 bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden shrink-0">
                            <div className="absolute inset-0 opacity-[0.02] grayscale pointer-events-none transition-all duration-1000"><Globe className="w-full h-full animate-spin-slow" /></div>
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3 relative z-10"><MapPin className="w-4 h-4 text-celestial-blue" /> PRODUCTION_ZONES</h4>
                            <div className="space-y-4 relative z-10">
                                {EARTHBONE_ZONES.map(z => (
                                    <div key={z.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all cursor-crosshair">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg bg-black/40 ${z.color}`}><Globe className="w-4 h-4" /></div>
                                            <span className={`text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-white`}>{z.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-mono text-gray-700 uppercase tracking-tighter">{z.region}</span>
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-bento p-10 flex-1 flex flex-col bg-slate-900/60 border-white/5 rounded-[3rem] shadow-xl min-h-0">
                            <div className="flex justify-between items-center mb-8 shrink-0">
                                <h4 className="zh-main text-base text-white tracking-widest uppercase">System_Insights</h4>
                                <div className="p-2 bg-celestial-purple/20 rounded-xl text-celestial-purple animate-ai-pulse"><Sparkles className="w-4 h-4" /></div>
                            </div>
                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-2">
                                <div className="p-6 bg-purple-500/5 rounded-[2rem] border border-purple-500/20 flex items-start gap-4">
                                    <Info className="w-5 h-5 text-celestial-purple shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-gray-400 leading-relaxed italic">
                                        "Detected task bottleneck in Taipei HQ. Recommend deploying 'Carbon Scout L2' agent to accelerate emission data verified sequence."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal - Aligned Aesthetics */}
            {isAdding && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
                    <div className="w-full max-w-xl glass-bento bg-slate-900 border border-white/10 rounded-[4rem] p-12 flex flex-col gap-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none"><Target className="w-64 h-64 text-white" /></div>
                        <button onClick={() => setIsAdding(false)} className="absolute top-10 right-10 p-3 hover:bg-white/5 rounded-2xl text-gray-500 transition-all z-10"><X className="w-8 h-8" /></button>

                        <div>
                            <h3 className="zh-main text-4xl text-white tracking-tighter">FORGE_DIRECTIVE</h3>
                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.5em] mt-2">Deploying neural instructions across production zones.</p>
                        </div>

                        <div className="space-y-5 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Shard_Title</label>
                                <input
                                    value={taskDraft.title}
                                    onChange={e => { setTaskDraft({ ...taskDraft, title: e.target.value }); if (errors.title) setErrors({ ...errors, title: '' }); }}
                                    className={`w-full bg-black/60 border rounded-2xl px-6 py-4 text-xl text-white focus:ring-1 outline-none transition-all placeholder:text-gray-800 ${errors.title ? 'border-rose-500/50' : 'border-white/10 focus:border-celestial-gold'}`}
                                    placeholder="Target directive name..."
                                />
                                {errors.title && <div className="flex items-center gap-1.5 text-[10px] text-rose-400 font-bold uppercase pl-2"><AlertCircle className="w-3 h-3" /> {errors.title}</div>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Execution_Context</label>
                                <textarea
                                    value={taskDraft.description}
                                    rows={4}
                                    onChange={e => { setTaskDraft({ ...taskDraft, description: e.target.value }); if (errors.description) setErrors({ ...errors, description: '' }); }}
                                    className={`w-full bg-black/60 border rounded-[2rem] px-6 py-5 text-sm text-gray-300 outline-none transition-all resize-none placeholder:text-gray-800 leading-relaxed shadow-inner ${errors.description ? 'border-rose-500/50' : 'border-white/10 focus:border-celestial-gold'}`}
                                    placeholder="Detailed instructions for agent sync..."
                                />
                                {errors.description && <div className="flex items-center gap-1.5 text-[10px] text-rose-400 font-bold uppercase pl-2"><AlertCircle className="w-3 h-3" /> {errors.description}</div>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Manifest_Date</label>
                                    <input
                                        type="date" value={taskDraft.dueDate}
                                        onChange={e => { setTaskDraft({ ...taskDraft, dueDate: e.target.value }); if (errors.dueDate) setErrors({ ...errors, dueDate: '' }); }}
                                        className={`w-full bg-black/60 border rounded-xl px-4 py-3 text-xs text-white outline-none ${errors.dueDate ? 'border-rose-500/50' : 'border-white/10'}`}
                                    />
                                    {errors.dueDate && <div className="text-[8px] text-rose-400 font-bold uppercase px-1">{errors.dueDate}</div>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Directive_Priority</label>
                                    <select value={taskDraft.priority} onChange={e => setTaskDraft({ ...taskDraft, priority: e.target.value as TaskPriority })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none appearance-none cursor-pointer">
                                        {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleCreateTask} className="w-full py-6 bg-white text-black font-black rounded-3xl uppercase tracking-[0.4em] text-xs shadow-2xl hover:bg-celestial-gold transition-all active:scale-95">DEPLOY_TO_KERNEL</button>
                    </div>
                </div>
            )}
        </div>
    );
};