'use client';

import React, { useState, useEffect } from 'react';
import { useOmniNotesStore, NoteType } from '@/store/useOmniNotesStore';
import {
    Calendar as CalendarIcon, Lightbulb, Users, CheckSquare,
    FileText, Send, Trash2, ChevronLeft, ChevronRight, Share2,
    Search, BookOpen
} from 'lucide-react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { format, addDays, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 定義標籤的視覺樣式
const TYPE_CONFIG: Record<NoteType, { icon: React.ElementType, label: string, color: string, bg: string }> = {
    log: { icon: FileText, label: '日誌', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
    idea: { icon: Lightbulb, label: '靈感', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    meeting: { icon: Users, label: '會議', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    task: { icon: CheckSquare, label: '任務', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    research: { icon: Search, label: '研究', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    knowledge: { icon: BookOpen, label: '知識', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
};

export function DailyNotesView() {
    const [mounted, setMounted] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [inputValue, setInputValue] = useState('');
    const [selectedType, setSelectedType] = useState<NoteType>('log');

    const { addNote, deleteNote, getNotesByDate, isSyncing } = useOmniNotesStore();

    // 格式化目前選取的日期字串 (YYYY-MM-DD) 以供查詢
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const dailyNotes = getNotesByDate(dateKey);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const handleSubmit = () => {
        if (!inputValue.trim()) return;
        addNote(inputValue, selectedType, dateKey);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit();
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6 text-slate-200">
            {/* 左側：極簡日曆導覽 */}
            <div className="w-64 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <CalendarIcon size={16} /> 日曆
                    </h2>
                    <div className="flex gap-1">
                        <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-1 hover:bg-slate-800 rounded">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-1 hover:bg-slate-800 rounded">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* 產生前後 3 天的快速切換選單 */}
                {Array.from({ length: 7 }).map((_, i) => {
                    const date = addDays(selectedDate, i - 3);
                    const isSelected = format(date, 'yyyy-MM-dd') === dateKey;
                    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                    return (
                        <button
                            key={i}
                            onClick={() => setSelectedDate(date)}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium border",
                                isSelected
                                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                    : "bg-transparent border-transparent hover:bg-slate-800/50 text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <span>{isToday ? '今天' : format(date, 'MM/dd')}</span>
                            <span className="text-[10px] uppercase tracking-wider opacity-50">{format(date, 'EEE')}</span>
                        </button>
                    );
                })}
            </div>

            {/* 右側：標籤筆記流 */}
            <div className="flex-1 flex flex-col max-w-3xl">
                <header className="mb-6">
                    <h1 className="text-3xl font-black text-white flex items-center gap-4">
                        {format(selectedDate, 'yyyy 年 MM 月 dd 日')}
                        {format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
                            <OmniBadge variant="primary" size="xs" className="mt-1">TODAY</OmniBadge>
                        )}
                    </h1>
                </header>

                {/* 輸入區塊 (Capacities 風格) */}
                <OmniBaseCard variant="glass" className="p-4 mb-8 border-slate-700/50 focus-within:border-cyan-500/50 transition-colors">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="記錄今天的靈感、會議紀錄或任務... (Cmd/Ctrl + Enter 送出)"
                        className="min-h-[100px] w-full border-none bg-transparent focus:ring-0 px-0 text-slate-200 resize-none font-medium"
                    />
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                        <div className="flex items-center gap-2">
                            {/* 物件類型選擇器 */}
                            {(Object.keys(TYPE_CONFIG) as NoteType[]).map((type) => {
                                const config = TYPE_CONFIG[type];
                                const Icon = config.icon;
                                const isActive = selectedType === type;
                                return (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                            isActive ? config.bg + ' ' + config.color : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300"
                                        )}
                                    >
                                        <Icon size={12} /> {config.label}
                                    </button>
                                );
                            })}
                            {/* 當選擇任務類型且正在同步時，顯示提示 */}
                            {selectedType === 'task' && isSyncing && (
                                <div className="flex items-center gap-1.5 text-xs text-cyan-400 animate-pulse">
                                    <Share2 size={12} /> <span>同步至 OmniTable...</span>
                                </div>
                            )}
                        </div>
                        <OmniButton onClick={handleSubmit} disabled={!inputValue.trim()} size="sm" className="rounded-full px-5">
                            <Send size={14} className="mr-2" /> 記錄
                        </OmniButton>
                    </div>
                </OmniBaseCard>

                {/* 筆記時間軸 (Stream) */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                    {dailyNotes.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 border border-dashed border-slate-700/50 rounded-2xl">
                            <CalendarIcon size={32} className="mx-auto mb-4 opacity-20" />
                            <p>這天還沒有留下任何紀錄。</p>
                        </div>
                    ) : (
                        dailyNotes.map((note) => {
                            const config = TYPE_CONFIG[note.type];
                            const Icon = config.icon;
                            return (
                                <div key={note.id} className="group flex gap-4">
                                    {/* 左側時間軸標記 */}
                                    <div className="flex flex-col items-center mt-1">
                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border", config.bg, config.color)}>
                                            <Icon size={14} />
                                        </div>
                                        <div className="w-[1px] h-full bg-slate-800 my-1 group-last:hidden" />
                                    </div>

                                    {/* 內容卡片 */}
                                    <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 hover:border-slate-600 transition-colors mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={cn("text-[10px] font-black tracking-widest uppercase", config.color)}>
                                                    {config.label}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-mono">
                                                    {format(new Date(note.createdAt), 'HH:mm')}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => deleteNote(note.id)}
                                                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        {/* 使用 ReactMarkdown 渲染筆記內容 */}
                                        <div className="prose prose-sm prose-invert max-w-none text-slate-300">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {note.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}