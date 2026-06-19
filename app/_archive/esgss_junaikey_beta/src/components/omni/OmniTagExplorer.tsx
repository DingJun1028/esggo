import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OmniTag } from '@/types/omniTag';
import { CORE_OMNI_TAGS, OmniTagManager } from '@/utils/omniTagManager';
import OmniTagBadge from '@/components/omni/OmniTagBadge';
import { Search, Plus, Filter, Database, Tag as TagIcon, LayoutGrid, List } from 'lucide-react';

/**
 * OmniTagExplorer: A tool to browse and test the OmniTag system.
 */
const OmniTagExplorer: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNamespace, setSelectedNamespace] = useState<string | 'all'>('all');

    const namespaces = ['all', ...new Set(CORE_OMNI_TAGS.map(t => t.namespace))];

    const filteredTags = CORE_OMNI_TAGS.filter(tag => {
        const matchesSearch =
            tag.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tag.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tag.namespace.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesNamespace = selectedNamespace === 'all' || tag.namespace === selectedNamespace;

        return matchesSearch && matchesNamespace;
    });

    return (
        <div className="bg-slate-950/40 border border-white/5 rounded-[32px] overflow-hidden flex flex-col h-[500px]">
            {/* Toolbar */}
            <div className="p-6 border-b border-white/5 bg-slate-900/20 backdrop-blur-md flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <TagIcon className="text-indigo-400" size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">萬能標籤本體論 (OmniTag Ontology)</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Semantic Metadata Core</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                        <input
                            type="text"
                            placeholder="搜索標籤..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs focus:border-indigo-500/50 focus:outline-none transition-all w-40"
                        />
                    </div>
                    <div className="flex bg-slate-900 border border-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <LayoutGrid size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <List size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Namespace Filter Bar */}
            <div className="px-6 py-3 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar bg-slate-900/10">
                {namespaces.map(ns => (
                    <button
                        key={ns}
                        onClick={() => setSelectedNamespace(ns)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedNamespace === ns
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                            : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                            }`}
                    >
                        {ns}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {viewMode === 'grid' ? (
                        <motion.div
                            layout
                            className="flex flex-wrap gap-3"
                        >
                            {filteredTags.map(tag => (
                                <motion.div
                                    key={OmniTagManager.stringify(tag)}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <OmniTagBadge tag={tag} interactive size="md" />
                                </motion.div>
                            ))}
                            <button className="h-9 px-4 border border-dashed border-white/10 rounded-lg text-slate-600 hover:text-slate-400 hover:border-white/20 transition-all flex items-center gap-2 text-xs">
                                <Plus size={14} /> 新增標籤
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            layout
                            className="space-y-2"
                        >
                            {filteredTags.map(tag => (
                                <motion.div
                                    key={OmniTagManager.stringify(tag)}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex items-center justify-between group"
                                >
                                    <OmniTagBadge tag={tag} showNamespace={false} />
                                    <div className="flex items-center gap-4">
                                        <div className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">
                                            {tag.namespace}
                                        </div>
                                        <div className="text-xs text-slate-400 font-medium">
                                            {tag.description || '核心語義單元'}
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                            <Database size={12} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Legend / Status */}
            <div className="px-6 py-4 border-t border-white/5 bg-slate-900/30 flex justify-between items-center">
                <div className="text-[10px] text-slate-600 font-medium italic">
                    符合 namespace:category:value 標準結構
                </div>
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">
                    Total Nodes: {filteredTags.length}
                </div>
            </div>
        </div>
    );
};

export default OmniTagExplorer;
