import React, { useEffect, useState } from 'react';
import { IOmniNote, OmniWuzuoNoteService } from "@/core/wuzuo-note";
import { BrainCircuit, Link2, Share2, Sparkles, Box } from "lucide-react";

interface Props {
    activeNote: IOmniNote | null;
    onSelectRelated?: (note: IOmniNote) => void;
}

/**
 * 🕸️ InsightMatrix - 知識矩陣因果鍊
 * 呈現知識點之間的自動連結與影響力維度
 */
export const InsightMatrix: React.FC<Props> = ({ activeNote, onSelectRelated }) => {
    const [related, setRelated] = useState<{ note: IOmniNote; similarity: number }[]>([]);

    useEffect(() => {
        if (activeNote) {
            OmniWuzuoNoteService.getRelatedNotes(activeNote).then(setRelated);
        } else {
            setRelated([]);
        }
    }, [activeNote]);

    return (
        <div className="h-full w-full bg-white/[0.02] rounded-[32px] border border-white/5 p-6 flex flex-col relative overflow-hidden group">
            {/* 裝飾性背景網格 */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <BrainCircuit size={14} className="text-cyan-400" />
                    <h4 className="text-[10px] font-black text-white/40 tracking-widest uppercase">Insight Matrix</h4>
                </div>
                <div className="flex gap-2">
                    <Link2 size={12} className="text-white/20 hover:text-white transition-colors cursor-pointer" />
                    <Share2 size={12} className="text-white/20 hover:text-white transition-colors cursor-pointer" />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                {!activeNote ? (
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center mx-auto mb-3">
                            <div className="w-2 h-2 rounded-full bg-cyan-500/20" />
                        </div>
                        <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Waiting for Resonance...</p>
                    </div>
                ) : (
                    <div className="w-full space-y-4">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all cursor-crosshair">
                            <span className="text-[7px] font-black text-cyan-400 uppercase tracking-widest block mb-1">Linked Entities</span>
                            <div className="flex flex-wrap gap-2">
                                {activeNote?.tags && activeNote.tags.length > 0 ? (
                                    activeNote.tags.map(tag => (
                                        <span key={tag.id} className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                            {tag.semantic}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[8px] text-white/10 italic">No quantum entities detected.</span>
                                )}
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-cyan-500/20 transition-all">
                            <span className="text-[7px] font-black text-cyan-400 uppercase tracking-widest block mb-1">Bridged Assets</span>
                            <div className="space-y-2 max-h-[60px] overflow-y-auto custom-scrollbar">
                                {related.length > 0 ? (
                                    related.map(({ note, similarity }) => (
                                        <div
                                            key={note.uuid}
                                            onClick={() => onSelectRelated?.(note)}
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group/link shadow-md ${
                                                activeNote?.uuid === note.uuid 
                                                ? 'border-aqua bg-aqua/20 shadow-[0_0_20px_rgba(99,166,176,0.4)] ring-1 ring-aqua/30' 
                                                : 'border-white/10 bg-white/5 hover:border-omni-primary/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <div
                                                    className={`w-1 h-1 rounded-full ${activeNote?.uuid === note.uuid ? 'bg-omni-primary animate-pulse' : 'bg-cyan-400'}`}
                                                    style={{ opacity: similarity }}
                                                />
                                                <span className={`text-[9px] truncate ${activeNote?.uuid === note.uuid ? 'text-omni-primary font-bold' : 'text-white/50 group-hover/link:text-cyan-300'}`}>
                                                    {note.title}
                                                </span>
                                            </div>
                                            <span className="text-[7px] font-mono text-cyan-500/40">
                                                {(similarity * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 border border-dashed border-white/10 opacity-30">
                                        <Box size={10} className="text-white" />
                                        <span className="text-[9px] text-white italic">Searching semantic neighbors...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 group/suggest relative">
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                                <Sparkles size={10} className="text-black" />
                            </div>
                            <span className="text-[7px] font-black text-amber-400 uppercase tracking-widest block mb-1">Dr. Thoth Suggestion</span>
                            <p className="text-[9px] text-white/60 leading-relaxed italic">
                                {activeNote.content?.includes('carbon')
                                    ? "「偵測到碳排放關鍵字。建議同步至 Excellence Carbon Hub 以執行高精度 Scope 1 驗算。」"
                                    : activeNote.status === 'Trustworthy'
                                        ? "「此資產已封印。數位誠信分數達成 100%，已準備好進入下一世代橋接。」"
                                        : "「內容流動中... 建議增加具象化指標 (Tangible) 以提升 5T 能量共鳴。」"}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* 底部邊緣特效 */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};
