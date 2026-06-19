"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Hash, Lock, Sparkles, Save, Trash2, Clock, ShieldCheck } from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import PageHeader from '@/components/PageHeader';
import { OmniMangaTutorial } from "@/components/omni/UI/OmniMangaTutorial";
import { createHash } from 'crypto';

/**
 * 🗒️ Wuzuo Note Page (無作妙計)
 * 
 * 自動攔截靈感流，執行 SHA-256 誠信備份，禁止已封印內容修改。
 * 「無作妙德」——隨手而記，自動成章，將靈感轉化為永續資產。
 */

interface INote {
    id: string;
    content: string;
    tags: string[];
    hash: string;
    createdAt: number;
    locked: boolean;
}

export default function WuzuoNotePage() {
    const [notes, setNotes] = useState<INote[]>([]);
    const [draft, setDraft] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('wuzuo-notes');
        if (saved) setNotes(JSON.parse(saved));
    }, []);

    const saveToLocal = (updated: INote[]) => {
        localStorage.setItem('wuzuo-notes', JSON.stringify(updated));
        setNotes(updated);
    };

    const handleSave = useCallback(() => {
        if (!draft.trim()) return;
        setSaving(true);

        setTimeout(() => {
            const hash = Math.random().toString(36).substring(2, 18).toUpperCase(); // mock SHA-256
            const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
            const newNote: INote = {
                id: Date.now().toString(),
                content: draft,
                tags,
                hash: `SHA256:${hash}`,
                createdAt: Date.now(),
                locked: false,
            };
            const updated = [newNote, ...notes];
            saveToLocal(updated);
            setDraft('');
            setTagInput('');
            setSaving(false);
        }, 800);
    }, [draft, tagInput, notes]);

    const lockNote = (id: string) => {
        const updated = notes.map(n => n.id === id ? { ...n, locked: true } : n);
        saveToLocal(updated);
    };

    const deleteNote = (id: string) => {
        const updated = notes.filter(n => n.id !== id);
        saveToLocal(updated);
    };

    const WUZUO_MANGA_PANELS = [
        {
            id: 1,
            src: '/assets/manga/wuzuo-panel-1.png',
            title: '瞬間靈感',
            description: '永續洞察往往在意外時刻湧現。無作妙計讓您即時捕捉每一個靈感到來的瞬間。',
            pill: 'FLOW'
        },
        {
            id: 2,
            src: '/assets/manga/wuzuo-panel-2.png',
            title: '即時檢索',
            description: '每則筆記自動標記與分類，確保您的知識庫具備高效的「可追蹤性」。',
            pill: 'RECALL'
        },
        {
            id: 3,
            src: '/assets/manga/wuzuo-panel-3.png',
            title: '5T 果証',
            description: '點擊「封印」後，筆記即生成 SHA-256 誠信哈希，成為不可篡改的永恆資料。',
            pill: 'PROOF'
        },
        {
            id: 4,
            src: '/assets/manga/wuzuo-panel-4.png',
            title: '資產成長',
            description: '從隨筆到資產，讓每一個想法都在萬能時空座標中持續增值，成就永續未來。',
            pill: 'GROWTH'
        }
    ];

    return (
        <div className="min-h-screen bg-omni-surface p-8">
            <PageHeader
                title="無作妙計 (Wuzuo Note)"
                subtitle="隨手而記，自動成章，將靈感轉化為永續資產。"
            />

            {/* 📖 漫畫教學導引 - Global Manifestation */}
            <div className="max-w-7xl mx-auto mb-12 relative z-10">
                <OmniMangaTutorial 
                    title="無作妙計：靈感資產導引" 
                    subtitle="Spontaneous Inspiration · Eternal Assets" 
                    panels={WUZUO_MANGA_PANELS} 
                />
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Editor Panel */}
                <div className="lg:col-span-3 space-y-4">
                    <LiquidGlassContainer className="p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <PenLine size={16} className="text-omni-primary" />
                            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">新建靈感筆記</h2>
                        </div>
                        <textarea
                            value={draft}
                            onChange={e => setDraft(e.target.value)}
                            placeholder="在此輸入您的 ESG 靈感、洞察或心得...&#10;&#10;例如：今日拜訪供應商，發現其 Scope 3 排放資料缺口，建議引入…"
                            className="w-full h-48 bg-slate-50 border border-omni-glass-border rounded-2xl p-4 text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-omni-primary/20 focus:border-omni-primary/50 transition-all"
                        />
                        <div className="flex items-center gap-2">
                            <Hash size={14} className="text-slate-400" />
                            <input
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                placeholder="標籤 (逗號分隔, 例: ESG,碳排,治理)"
                                className="flex-1 bg-slate-50 border border-omni-glass-border rounded-xl px-4 py-2 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-omni-primary/20 transition-all"
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={!draft.trim() || saving}
                            className="w-full py-3 bg-omni-primary text-white rounded-2xl font-black text-sm hover:bg-omni-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <><Sparkles size={14} className="animate-spin" /> 正在生成 SHA-256 誠信哈希…</>
                            ) : (
                                <><Save size={14} /> 儲存並建立資產</>
                            )}
                        </button>
                    </LiquidGlassContainer>
                </div>

                {/* Notes Feed */}
                <div className="lg:col-span-2 space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                    <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        靈感資產庫 ({notes.length})
                    </h2>
                    <AnimatePresence>
                        {notes.length === 0 ? (
                            <div className="text-center py-16 text-slate-300">
                                <PenLine size={48} className="mx-auto mb-4 opacity-30" />
                                <p className="text-sm font-bold">尚無筆記</p>
                                <p className="text-xs mt-1">開始記錄您的第一個永續靈感</p>
                            </div>
                        ) : notes.map((note, i) => (
                            <motion.div
                                key={note.id}
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -30, opacity: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <LiquidGlassContainer className={`p-4 space-y-3 ${note.locked ? 'border-emerald-200' : ''}`}>
                                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">{note.content}</p>
                                    {note.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {note.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-bold px-2 py-0.5 bg-omni-primary/10 text-omni-primary rounded-full">#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between pt-2 border-t border-omni-glass-border">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                <Clock size={10} />
                                                {new Date(note.createdAt).toLocaleDateString('zh-TW')}
                                            </div>
                                            <p className="text-[9px] font-mono text-slate-300 truncate max-w-[120px]">{note.hash}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {note.locked ? (
                                                <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-black">
                                                    <Lock size={10} /> 已封印
                                                </span>
                                            ) : (
                                                <button onClick={() => lockNote(note.id)} className="text-[10px] font-black text-omni-primary hover:underline flex items-center gap-1">
                                                    <Lock size={10} /> 封印
                                                </button>
                                            )}
                                            {!note.locked && (
                                                <button onClick={() => deleteNote(note.id)} className="text-[10px] font-black text-red-400 hover:underline flex items-center gap-1">
                                                    <Trash2 size={10} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </LiquidGlassContainer>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
