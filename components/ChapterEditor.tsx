import React from 'react';
import { useSustainWriteStore } from '../store/useSustainWriteStore';
import { Bot, RefreshCw, Type } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChapterEditorProps {
    chapterId: string;
    chapterName: string;
    chapterOrder: number;
    griRefs: string[];
}

export function ChapterEditor({ chapterId, chapterName, chapterOrder, griRefs }: ChapterEditorProps) {
    const { 
        generatedContent, 
        updateContent, 
        commitHistory, 
        undoContent, 
        redoContent, 
        expandContentWithAI, 
        isGeneratingAI,
        contentHistory
    } = useSustainWriteStore();

    const content = generatedContent[chapterId] || '';

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Toolbar */}
            <div className="h-12 px-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Type size={14} className="text-cyan-600" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{chapterName}</span>
                    </div>
                    
                    <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                    
                    <div className="flex gap-1">
                        <button 
                            onClick={() => undoContent(chapterId, chapterName, chapterOrder, griRefs)}
                            disabled={!(contentHistory[chapterId]?.past.length > 0) || isGeneratingAI[chapterId]}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 disabled:opacity-20 transition-all"
                            title="復原"
                        >
                            <RefreshCw size={14} className="-scale-x-100" />
                        </button>
                        <button 
                            onClick={() => redoContent(chapterId, chapterName, chapterOrder, griRefs)}
                            disabled={!(contentHistory[chapterId]?.future.length > 0) || isGeneratingAI[chapterId]}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 disabled:opacity-20 transition-all"
                            title="重做"
                        >
                            <RefreshCw size={14} />
                        </button>
                    </div>
                </div>

                <button 
                    onClick={() => expandContentWithAI(chapterId, chapterName, chapterOrder, griRefs)}
                    disabled={isGeneratingAI[chapterId]}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full border border-indigo-100 transition-all disabled:opacity-50"
                >
                    {isGeneratingAI[chapterId] ? <RefreshCw size={12} className="animate-spin" /> : <Bot size={12} />}
                    <span className="text-[10px] font-bold uppercase tracking-tight">
                        {isGeneratingAI[chapterId] ? 'OmniAgent Expanding...' : 'Expert AI Expansion'}
                    </span>
                </button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative">
                <textarea 
                    value={content}
                    onChange={(e) => updateContent(chapterId, e.target.value, chapterName, chapterOrder, griRefs)}
                    onBlur={() => commitHistory(chapterId)}
                    disabled={isGeneratingAI[chapterId]}
                    placeholder="ESG 治理主權由您執筆..."
                    className={cn(
                        "w-full h-full p-8 text-sm font-medium leading-[1.8] text-slate-800 outline-none resize-none bg-transparent transition-all",
                        isGeneratingAI[chapterId] && "opacity-50 blur-[0.5px]"
                    )}
                />
                
                {/* AI Loading Overlay */}
                <div className={cn(
                    "absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px] transition-all duration-500 pointer-events-none",
                    isGeneratingAI[chapterId] ? 'opacity-100' : 'opacity-0'
                )}>
                    <div className="p-4 bg-white/80 rounded-2xl border border-indigo-100 shadow-2xl flex flex-col items-center gap-3">
                        <RefreshCw size={24} className="text-indigo-600 animate-spin" />
                        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Generating Content...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}