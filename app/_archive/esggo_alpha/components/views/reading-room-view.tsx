"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, 
    ShieldCheck, 
    History, 
    Search, 
    Filter,
    ArrowUpRight,
    FileText,
    Database,
    Zap,
    ExternalLink,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { getReadingRoomItems } from '@/app/actions';
import { toast } from 'sonner';

interface ReadingRoomItem {
    id: string;
    name: string;
    category: string;
    type: string;
    status: string;
    auditTrail: { action: string; timestamp: string; actor: string }[];
}

export function ReadingRoomView() {
    const [items, setItems] = useState<ReadingRoomItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        setLoading(true);
        try {
            const res = await getReadingRoomItems();
            if (res.success) {
                setItems(res.items as ReadingRoomItem[]);
            } else {
                toast.error("Failed to load reading room items.");
            }
        } catch (e) {
            toast.error("An error occurred while fetching items.");
        } finally {
            setLoading(false);
        }
    }

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
            {/* Header Section */}
            <div className="p-8 pb-4 flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <motion.h1 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"
                        >
                            ESG Reading Room
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-400 mt-1 flex items-center gap-2"
                        >
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            V8.1 SEAL Protocol • Verified Data Vault
                        </motion.p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={fetchItems}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                            title="Refresh Room"
                        >
                            <Zap className={`w-5 h-5 ${loading ? 'animate-pulse text-emerald-400' : 'text-slate-300'}`} />
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="text"
                            placeholder="Search synced evidence..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                    </div>
                    <button className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors">
                        <Filter className="w-4 h-4" />
                        Category
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full animate-ping"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BookOpen className="w-8 h-8 text-emerald-500 animate-pulse" />
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm font-medium animate-pulse">Accessing Secure Vault...</p>
                        </div>
                    ) : filteredItems.length > 0 ? (
                        <motion.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {filteredItems.map((item, index) => (
                                <ReadingRoomItemCard 
                                    key={item.id} 
                                    item={item} 
                                    index={index}
                                    isExpanded={expandedItem === item.id}
                                    onToggle={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center h-80 bg-slate-900/20 border border-dashed border-white/10 rounded-[2rem] p-12 text-center"
                        >
                            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/5">
                                <BookOpen className="w-10 h-10 text-slate-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-300 mb-2">The Reading Room is Empty</h3>
                            <p className="text-slate-500 max-w-sm mb-8">
                                Sync intelligence sources from the main dashboard to build your verified ESG evidence base.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function ReadingRoomItemCard({ 
    item, 
    index, 
    isExpanded, 
    onToggle 
}: { 
    item: ReadingRoomItem; 
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative flex flex-col bg-slate-900/40 border transition-all duration-300 overflow-hidden ${
                isExpanded ? 'ring-2 ring-emerald-500/50 border-emerald-500/50 rounded-[2rem]' : 'hover:bg-slate-900/60 border-white/5 rounded-[1.5rem]'
            }`}
        >
            {/* Hover Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="p-5 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${
                            item.type === 'DATA' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-teal-500/10 text-teal-400'
                        }`}>
                            {item.type === 'DATA' ? <Database className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">{item.name}</h4>
                            <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">{item.category}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                            AUDIT READY
                        </div>
                        <button 
                            onClick={onToggle}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all"
                        >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex -space-x-2">
                        {/* Mock Avatar for Auditor */}
                        <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400">AI</div>
                        <div className="w-6 h-6 rounded-full bg-emerald-950 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-emerald-400">5T</div>
                    </div>
                    <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-emerald-500/5 transition-all">
                        View Details
                        <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Expanded Audit Trail Section */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-black/20 border-t border-white/5 overflow-hidden"
                    >
                        <div className="p-5 pt-0 space-y-4 mt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <History className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Digital Audit Trail</span>
                            </div>
                            
                            <div className="space-y-3">
                                {item.auditTrail.map((audit, i) => (
                                    <div key={i} className="flex gap-3 relative">
                                        {i < item.auditTrail.length - 1 && (
                                            <div className="absolute left-[7px] top-4 w-[1px] h-full bg-white/5" />
                                        )}
                                        <div className={`w-3.5 h-3.5 rounded-full mt-0.5 border-2 z-10 ${
                                            audit.action === 'Synced' ? 'bg-emerald-500 border-slate-900' : 'bg-teal-500 border-slate-900'
                                        }`} />
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between">
                                                <span className="text-xs font-semibold text-slate-300">{audit.action}</span>
                                                <span className="text-[10px] text-slate-500">{new Date(audit.timestamp).toLocaleString()}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400">Actor: {audit.actor}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-white/5 flex gap-2">
                                <button className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-300 transition-all flex items-center justify-center gap-2">
                                    <ExternalLink className="w-3 h-3" />
                                    Source Link
                                </button>
                                <button className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[11px] font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20">
                                    <ShieldCheck className="w-3 h-3" />
                                    Verify Hash
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
