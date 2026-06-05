'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, Search, Hash, Lock, Activity, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import StandardPage from '@/components/brand/StandardPage';
import { UniversalPageConfig } from '@/lib/page-config';

interface TraceNode {
  id: string;
  type: 'source' | 'metric' | 'report' | 'seal';
  label: string;
  hash: string;
  timestamp: string;
  parentId?: string;
}

export default function CausalityDashboard() {
  const [nodes, setNodes] = useState<TraceNode[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCausalityData = async () => {
    setLoading(true);
    // Simulating fetching 5T causality data
    setTimeout(() => {
      setNodes([
        { id: '1', type: 'source', label: 'Raw Energy Data (Excel)', hash: 'a1b2c3d4...', timestamp: '2026-05-28T10:00:00Z' },
        { id: '2', type: 'metric', label: 'Scope 2 GHG Emissions', hash: 'e5f6g7h8...', timestamp: '2026-05-28T10:15:00Z', parentId: '1' },
        { id: '3', type: 'report', label: 'GRI 305 Chapter Draft', hash: 'i9j0k1l2...', timestamp: '2026-05-28T10:30:00Z', parentId: '2' },
        { id: '4', type: 'seal', label: 'ZKP Hash Lock (T4)', hash: 'm3n4o5p6...', timestamp: '2026-05-28T10:45:00Z', parentId: '3' },
      ]);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchCausalityData();
  }, []);

  const pageConfig: UniversalPageConfig = {
    id: 'causality-dashboard',
    title: '?†Ê?ËøΩÊ∫Ø?ÄË°®Êùø ??',
    subtitle: '5T Protocol ?∏Ê??üÂëΩ?±Ê???Hash ËøΩËπ§ÔºåÂØ¶?æÂ??®Á??åÂèØÊ∫ØÊ??çË??å‰??ØÁØ°?π„Äç„Ä?,
    icon: <Network size={32} className="text-emerald-soul" />,
    griReference: 'Causality / 5T',
    activeT5Tags: ['T1', 'T4', 'T5'],
    isOXModule: true,
    
    primaryActions: [
      { id: 'refresh', label: '?çÊñ∞?åÊ≠• (Sync)', icon: <RefreshCw size={16}/>, onClick: fetchCausalityData }
    ],

    sections: [
      {
        id: 'trace-view',
        title: 'Ê∫ØÊ??àË∑Ø (Traceability Chain)',
        columns: 12,
        component: (
          <Card className="p-8 bg-white/60 shadow-glass min-h-[500px]">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw size={32} className="animate-spin text-berkeley-blue/50" />
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan-400/0 before:via-cyan-400/50 before:to-cyan-400/0">
                {nodes.map((node, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.2, type: 'spring', bounce: 0.4 }}
                    key={node.id} 
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-cyan-400 to-berkeley-blue text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 cursor-pointer"
                    >
                      {node.type === 'source' && <Activity size={20} />}
                      {node.type === 'metric' && <Hash size={20} />}
                      {node.type === 'report' && <Search size={20} />}
                      {node.type === 'seal' && <Lock size={20} className="text-california-gold drop-shadow-md" />}
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02, x: i % 2 === 0 ? 10 : -10 }}
                      className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white/40 backdrop-blur-md shadow-glass border border-cyan-500/20 hover:border-cyan-400/60 transition-all cursor-pointer relative overflow-hidden"
                    >
                      {/* Subtle background glow */}
                      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                      
                      <div className="flex items-center justify-between mb-2 relative z-10">
                        <Badge variant="verified" className="text-[10px] uppercase bg-cyan-100 text-cyan-800 border-cyan-200">{node.type}</Badge>
                        <time className="text-[10px] font-mono text-cyan-800/60 font-bold">{new Date(node.timestamp).toLocaleTimeString()}</time>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 mb-2 relative z-10">{node.label}</h4>
                      <div className="text-xs font-mono text-slate-600 bg-white/60 p-2 rounded border border-cyan-100 flex items-center gap-2 relative z-10 shadow-sm">
                        <Lock size={12} className="text-cyan-500" /> 
                        {node.hash}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
