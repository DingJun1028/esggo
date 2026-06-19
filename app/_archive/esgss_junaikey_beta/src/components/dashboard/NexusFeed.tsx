import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, Shield, Bot, Terminal, Check, X, Bell } from 'lucide-react';
import { OmniNexus, type NexusEvent } from '../../services/OmniNexus';

export const NexusFeed: React.FC = () => {
  const [events, setEvents] = useState<NexusEvent[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Initial load
    setEvents(OmniNexus.getHistory());

    // Subscribe
    const unsubscribe = OmniNexus.subscribe(newEvent => {
      setEvents(prev => [newEvent, ...prev].slice(0, 50));
    });
  }, [events]); // Fixed: Added events to dependency array to reflect actual usage

  const getIcon = (source: string) => {
    switch (source) {
      case 'legion':
        return <Bot className="w-4 h-4 text-purple-400" />;
      case 'knowledge':
        return <Brain className="w-4 h-4 text-cyan-400" />;
      case 'security':
        return <Shield className="w-4 h-4 text-yellow-400" />;
      case 'system':
        return <Terminal className="w-4 h-4 text-gray-400" />;
      default:
        return <Activity className="w-4 h-4 text-white" />;
    }
  };

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
      case 'high':
        return 'border-orange-500';
      case 'normal':
        return 'border-white/10';
      case 'low':
        return 'border-white/5 opacity-70';
      default:
        return 'border-white/10';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      {/* Feed Container */}
      <div
        className={`w-80 pointer-events-auto transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Omni-Nexus Feed
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] text-gray-500 font-mono">{events.length} events</span>
              <button onClick={() => setIsOpen(false)} className="hover:text-white text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-2">
            <AnimatePresence initial={false}>
              {events.map(event => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className={`bg-white/5 border rounded-lg p-3 ${getBorderColor(event.priority)}`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 shrink-0">{getIcon(event.source)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            event.source === 'legion'
                              ? 'text-purple-400'
                              : event.source === 'knowledge'
                                ? 'text-cyan-400'
                                : 'text-gray-400'
                          }`}
                        >
                          {event.source}
                        </span>
                        <span className="text-[9px] text-gray-600">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed break-words">
                        {event.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {events.length === 0 && (
              <div className="text-center py-8 text-gray-600 text-xs italic">
                System Quiet. Waiting for signals...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="mt-2 w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-lg hover:bg-cyan-500 pointer-events-auto"
        >
          <Bell className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};
