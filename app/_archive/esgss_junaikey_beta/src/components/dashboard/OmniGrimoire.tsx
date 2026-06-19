import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Sparkles, Search, Zap, Eye, Globe, Filter, Scroll } from 'lucide-react';
import { omniSynthesizer, SynthesisEvent } from '../../services/OmniSynthesizer';

export const OmniGrimoire: React.FC = () => {
  const [events, setEvents] = useState<SynthesisEvent[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'MIRACLE' | 'PROPHECY'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents([...omniSynthesizer.getLog()]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter(e => {
    if (filter !== 'ALL' && e.type !== filter) return false;
    if (searchTerm && !e.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/40">
            <Book className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              Omni Grimoire
            </h3>
            <p className="text-[10px] text-purple-400/70 font-mono">SYNTHESIZED_WISDOM_LOG_v1.0</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="SEARCH WISDOM..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-full pl-8 pr-4 py-1.5 text-[10px] text-white w-48 focus:outline-none focus:border-purple-500/50 font-mono"
            />
          </div>
          <button
            onClick={() =>
              setFilter(filter === 'ALL' ? 'MIRACLE' : filter === 'MIRACLE' ? 'PROPHECY' : 'ALL')
            }
            className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Filter className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Event Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {filteredEvents.map(event => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-xl border border-white/5 relative overflow-hidden group ${
                event.type === 'MIRACLE'
                  ? 'bg-amber-500/5 hover:border-amber-500/30'
                  : event.type === 'PROPHECY'
                    ? 'bg-cyan-500/5 hover:border-cyan-500/30'
                    : 'bg-white/5'
              }`}
            >
              {/* Type Indicator */}
              <div className="flex justify-between items-start mb-2">
                <div
                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    event.type === 'MIRACLE'
                      ? 'bg-amber-500/20 text-amber-400'
                      : event.type === 'PROPHECY'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {event.type === 'MIRACLE' ? (
                    <Sparkles className="w-3 h-3" />
                  ) : event.type === 'PROPHECY' ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <Scroll className="w-3 h-3" />
                  )}
                  {event.type}
                </div>
                <span className="text-[9px] font-mono text-gray-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {/* Content */}
              <h4 className="text-sm font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                {event.description}
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                {event.synthesizedInsight}
              </p>

              {/* Factors Grid */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
                <div className="text-center">
                  <div className="text-[8px] text-gray-600 uppercase mb-0.5 flex items-center justify-center gap-1">
                    <Zap className="w-2.5 h-2.5" /> Quantum
                  </div>
                  <div className="text-[10px] font-mono text-gray-300">
                    {event.factors.quantumEnergy} QE
                  </div>
                </div>
                <div className="text-center border-l border-white/5">
                  <div className="text-[8px] text-gray-600 uppercase mb-0.5 flex items-center justify-center gap-1">
                    <Globe className="w-2.5 h-2.5" /> Nexus
                  </div>
                  <div className="text-[10px] font-mono text-gray-300">
                    {event.factors.nexusGScore} GS
                  </div>
                </div>
                <div className="text-center border-l border-white/5">
                  <div className="text-[8px] text-gray-600 uppercase mb-0.5 flex items-center justify-center gap-1">
                    <Eye className="w-2.5 h-2.5" /> Oracle
                  </div>
                  <div className="text-[10px] font-mono text-gray-300">
                    {(event.factors.oracleConfidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-gray-600">
            <Book className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-xs uppercase tracking-widest">No Wisdom Synthesized Yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
