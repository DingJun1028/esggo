'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { ZenEditor } from "./ZenEditor";
import { InsightMatrix } from "./InsightMatrix";
import { EnergyAura } from "./EnergyAura";
import { OmniYuantong } from "./OmniYuantong";
import { OmniErrorBoundary } from "./OmniErrorBoundary";
import { OmniSpace } from "./OmniSpace";
import { OmniTable } from "../liquid-glass/OmniTable";
import { IOmniNote } from "@/core/wuzuo-note";
import { LayoutGrid, List, Sparkles, Tag as TagIcon, Box, Table as TableIcon, Trash2 } from "lucide-react";
import { IOmniTag } from "@/core/omni-types";
import { useSafeCallback } from "@/hooks/useSafeCallback";
import { IOmniAtom } from "@/core/omni-types";
import { OmniKnowledgeBridge } from "@/core/omni-knowledge-bridge";
import { OmniWuzuoNoteService } from "@/core/wuzuo-note";

// 🌿 Performance Note: Added memoization to core containers

interface Props {
    notes: IOmniNote[];
    activeNote: IOmniNote | null;
    onSelectNote: (note: IOmniNote) => void;
    onUpdateNote: (note: IOmniNote) => void;
    onDeleteNote: (uuid: string) => void;
}

/**
 * 🏛️ WuzuoHome - 內容屋主容器
 * 實作「內容屋」最佳實踐：模組化、可視化、資產化
 * 三欄式佈局：[內容矩陣 | 編輯室 | 圓通閘道]
 */
export const WuzuoHome: React.FC<Props> = ({ notes, activeNote, onSelectNote, onUpdateNote, onDeleteNote }) => {
    const [viewMode, setViewMode] = React.useState<'standard' | 'hypercube' | 'table'>('standard');

    const handleOmniAction = React.useCallback((action: string, payload?: any) => {
        console.log(`[OmniAction] ${action}`, payload);

        if (action === 'tag-click' && activeNote) {
            const semantic = typeof payload === 'string' ? payload : payload.semantic;
            const cleanSemantic = semantic.startsWith('#') ? semantic : `#${semantic}`;

            const newTag: IOmniTag = {
                id: `tag-${Date.now()}`,
                semantic: cleanSemantic,
                dimension: 'AI_Inferred',
                weight: 0.95,
                reliability: 1.0,
                category: 'Insight'
            };

            if (!activeNote.tags?.some(t => t.semantic === cleanSemantic)) {
                onUpdateNote({
                    ...activeNote,
                    tags: [...(activeNote.tags || []), newTag]
                });
            }
        }

        // 🌉 Knowledge Bridge Handlers
        if (action === 'export:markdown' && activeNote) {
            const md = OmniKnowledgeBridge.exportToMarkdown(activeNote);
            const blob = new Blob([md], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${activeNote.title || 'Note'}.md`;
            a.click();
        }

        if (action === 'export:json') {
            OmniKnowledgeBridge.exportAllToJSON().then(json => {
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `OmniKnowledge_Backup_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
            });
        }

        if (action === 'import:markdown') {
            // 實作檔案選擇器
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.md,.markdown';
            input.onchange = async (e: any) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = async (re) => {
                        const content = re.target?.result as string;
                        const newNote = await OmniKnowledgeBridge.importFromMarkdown(file.name, content);
                        onSelectNote(newNote);
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        }
    }, [activeNote, onUpdateNote, onSelectNote]);

    const noteList = React.useMemo(() => (
        notes.map((note) => (
            <motion.div
                key={note.uuid}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => onSelectNote(note)}
                className={`
                    p-4 rounded-xl border transition-all cursor-pointer group
                    ${activeNote?.uuid === note.uuid
                        ? 'bg-cyan-500/10 border-cyan-500/40 border-2'
                        : 'bg-white/5 border-white/5 hover:border-white/20'}
                `}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-sm font-bold ${activeNote?.uuid === note.uuid ? 'text-cyan-300' : 'text-white/70'}`}>
                        {note.title || 'Untitled Thought'}
                    </h3>
                    <div className="flex items-center gap-2">
                        {note.status === 'Trustworthy' && (
                            <div className="w-2 h-2 rounded-full bg-amber-400 border border-amber-400/20" />
                        )}
                        {note.status !== 'Trustworthy' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteNote(note.uuid);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-[10px] text-white/30 line-clamp-2 font-light">
                    {note.content || 'Empty flow...'}
                </p>
                <div className="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-mono text-white/20">{note.uuid.slice(0, 8)}</span>
                    <span className="text-[8px] font-bold text-cyan-500/60 uppercase tracking-widest">Open Room</span>
                </div>
            </motion.div>
        ))
    ), [notes, activeNote?.uuid, onSelectNote]);

    // 轉換 Note 為 Atom 格式供 OmniTable 使用
    const noteAtoms: IOmniAtom<any>[] = React.useMemo(() => (
        notes.map(note => ({
            uuid: note.uuid,
            timestamp: Date.now(),
            intent: note.title,
            type: 'Intelligence',
            payload: { content: note.content },
            domainRef: 'Wuzuo_Note',
            impactMetric: 'Knowledge Asset',
            sourceOrigin: 'User_Input',
            formula: 'Cognitive_Synthesis',
            isFrozen: note.status === 'Trustworthy',
            tags: note.tags || [],
            quality: 1,
            signature: 'sys_gen',
            hash_lock: 'pending',
            protocol: '5T_v1'
        } as any))
    ), [notes]);

    const tableColumns = React.useMemo(() => [
        { key: 'intent', header: 'Intent / Title' },
        { key: 'domainRef', header: 'Domain' },
        { key: 'impactMetric', header: 'Impact' },
        { key: 'timestamp', header: 'Captured' },
        { key: 'status', header: '5T Status' }
    ], []);

    return (
        <OmniErrorBoundary>
            <div
                className="flex flex-col h-full w-full gap-6 p-4"
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = Array.from(e.dataTransfer.files);
                    for (const file of files) {
                        if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
                            const content = await file.text();
                            const newNote = await OmniKnowledgeBridge.importFromMarkdown(file.name, content);
                            onSelectNote(newNote);
                        }
                    }
                }}
            >
                {/* 頂部導航與狀態 */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">Wuzuo Stratagem</h1>
                        <p className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.4em]">Actionless Virtue · Knowledge as Asset</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('standard')}
                            className={`p-2 rounded-lg border transition-all ${viewMode === 'standard' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-cyan-400'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg border transition-all ${viewMode === 'table' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-cyan-400'}`}
                        >
                            <TableIcon size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('hypercube')}
                            className={`p-2 rounded-lg border transition-all ${viewMode === 'hypercube' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-cyan-400'}`}
                        >
                            <Box size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex gap-6 overflow-hidden">
                    {/* 左側：內容矩陣 (Content Matrix) */}
                    <div className="w-1/4 flex flex-col gap-6">
                        <LiquidGlassContainer
                            enablePerspective
                            glowColor="indigo"
                            className="flex-1 overflow-y-auto custom-scrollbar p-0"
                        >
                            <div className="p-4 border-b border-white/5 flex justify-between items-center sticky top-0 bg-black/20 backdrop-blur-md z-20">
                                <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">Content Matrix</span>
                                <Sparkles size={12} className="text-amber-400 animate-pulse" />
                            </div>
                            <div className="grid grid-cols-1 gap-2 p-4">
                                {noteList}
                            </div>
                        </LiquidGlassContainer>

                        {/* 5T 能量感知 */}
                        <div className="h-[180px]">
                            <EnergyAura
                                isSealed={activeNote?.status === 'Trustworthy'}
                                metrics={{
                                    traceable: activeNote?.status === 'Trustworthy' ? 100 : 75,
                                    transparent: activeNote?.status === 'Trustworthy' ? 100 : 60,
                                    trackable: activeNote?.status === 'Trustworthy' ? 100 : 80,
                                    timely: activeNote?.status === 'Trustworthy' ? 100 : 90,
                                    trustworthy: activeNote?.status === 'Trustworthy' ? 100 : 45,
                                }}
                            />
                        </div>
                    </div>

                    {/* 中間主展示區 (Main Workspace Area) */}
                    <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                        {viewMode === 'standard' && (
                            <>
                                <div className="flex-1 min-h-0">
                                    <ZenEditor
                                        note={activeNote}
                                        onUpdate={(updated: IOmniNote) => onUpdateNote(updated)}
                                    />
                                </div>
                                <div className="h-[180px]">
                                    <InsightMatrix
                                        activeNote={activeNote}
                                        onSelectRelated={onSelectNote}
                                    />
                                </div>
                            </>
                        )}

                        {viewMode === 'table' && (
                            <div className="flex-1 overflow-hidden">
                                <OmniTable
                                    data={noteAtoms as any[]}
                                    title="CHRONICLE_OF_ASSETS"
                                    columns={tableColumns}
                                />
                            </div>
                        )}

                        {viewMode === 'hypercube' && (
                            <div className="flex-1 overflow-hidden">
                                <OmniSpace />
                            </div>
                        )}
                    </div>

                    {/* 右側：OmniYuantong 萬能圓通閘道 */}
                    <div className="w-1/4">
                        <OmniYuantong
                            activeNote={activeNote}
                            onAction={handleOmniAction}
                        />
                    </div>
                </div>
            </div>
        </OmniErrorBoundary>
    );
};
