
import React from 'react';
import { UniversalKnowledgeNode } from '../../types';

interface MemoryShardsProps {
    nodes: UniversalKnowledgeNode[];
}

export const MemoryShards: React.FC<MemoryShardsProps> = React.memo(({ nodes }) => {
    return (
        <div className="h-[260px] glass-bento p-5 bg-slate-900/60 border-white/5 rounded-3xl flex flex-col min-h-0 overflow-hidden shadow-xl shrink-0">
            <h4 className="text-[8px] font-black text-gray-700 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Active_Memory_Shards</h4>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 pr-1">
                {nodes.sort((a, b) => (b.growth?.heat || 0) - (a.growth?.heat || 0)).slice(0, 8).map(node => (
                    <div key={node.id} className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: (node.growth?.heat || 0) > 10 ? '#10b981' : '#334155' }} />
                            <div className="text-[8px] font-bold text-gray-600 truncate group-hover:text-gray-300 transition-colors uppercase">{node.label.text}</div>
                        </div>
                        <span className="text-[7px] font-mono text-emerald-500/60 font-black">{(node.growth?.heat || 0).toFixed(1)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});
