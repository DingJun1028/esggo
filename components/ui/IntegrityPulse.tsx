'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Activity, CheckCircle2, Lock, Database } from 'lucide-react';
import { BrandCard, BrandBadge, BrandStatusDot } from '../brand';
import { cn } from '../../lib/utils';

interface PulseEvent {
  id: string;
  type: 'SEAL' | 'ZKP' | 'CONSENSUS' | 'SYNC';
  label: string;
  timestamp: string;
}

export function IntegrityPulse() {
  const [events, setEvents] = useState<PulseEvent[]>([]);
  const [isPulsing, setIsPulsing] = useState(false);

  // Simulate incoming real-time integrity events
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldTrigger = Math.random() > 0.7;
      if (shouldTrigger) {
        const types: PulseEvent['type'][] = ['SEAL', 'ZKP', 'CONSENSUS', 'SYNC'];
        const type = types[Math.floor(Math.random() * types.length)];
        const labels = {
          SEAL: 'New 5T MasterSeal generated',
          ZKP: 'ZKP Range Proof verified',
          CONSENSUS: 'Swarm consensus reached',
          SYNC: 'Eternal Memory consolidated'
        };

        const newEvent: PulseEvent = {
          id: Math.random().toString(36).substring(7),
          type,
          label: labels[type],
          timestamp: new Date().toLocaleTimeString()
        };

        setEvents(prev => [newEvent, ...prev].slice(0, 5));
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrandCard padding="none" className="glass-panel border-none shadow-lg overflow-hidden bg-slate-900 text-white h-full flex flex-col">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity size={18} className="text-primary-400" />
            {isPulsing && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute inset-0 bg-primary-400 rounded-full -z-10"
              />
            )}
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-200">Live Integrity Pulse</h4>
            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Real-time Sovereignty Feed</p>
          </div>
        </div>
        <BrandStatusDot status="active" pulse size="sm" />
      </div>

      <div className="flex-1 p-4 sm:p-5 relative overflow-hidden flex flex-col justify-center items-center min-h-[160px] sm:min-h-[180px]">
        {/* Animated Background Radar */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-32 h-32 sm:w-48 sm:h-48 border border-white rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.2, 0.05] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            className="w-32 h-32 sm:w-48 sm:h-48 border border-white rounded-full"
          />
        </div>

        <div className="relative z-10 text-center space-y-3 sm:space-y-4 w-full">
           <AnimatePresence mode="popLayout">
              {events.length > 0 ? (
                <motion.div 
                  key={events[0].id}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="space-y-1.5 sm:space-y-2"
                >
                   <div className="flex justify-center gap-2">
                      {events[0].type === 'SEAL' && <Shield size={20} className="text-emerald-400 sm:w-6 sm:h-6" />}
                      {events[0].type === 'ZKP' && <Lock size={20} className="text-purple-400 sm:w-6 sm:h-6" />}
                      {events[0].type === 'CONSENSUS' && <Zap size={20} className="text-gold-400 sm:w-6 sm:h-6" />}
                      {events[0].type === 'SYNC' && <Database size={20} className="text-blue-400 sm:w-6 sm:h-6" />}
                   </div>
                   <p className="text-[10px] sm:text-xs font-black uppercase tracking-tight text-white">{events[0].label}</p>
                   <p className="text-[8px] sm:text-[9px] font-mono text-white/40">Timestamp: {events[0].timestamp}</p>
                </motion.div>
              ) : (
                <div className="space-y-2 opacity-20">
                   <Shield size={28} className="mx-auto sm:w-8 sm:h-8" />
                   <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">Listening for Network Events...</p>
                </div>
              )}
           </AnimatePresence>
        </div>
      </div>

      <div className="p-3 sm:p-4 bg-black/20 border-t border-white/5 max-h-[80px] sm:max-h-[100px] overflow-y-auto no-scrollbar">
         <div className="space-y-2">
            {events.slice(1).map(e => (
              <div key={e.id} className="flex items-center justify-between text-[8px] font-mono opacity-40">
                 <span className="flex items-center gap-1">
                    <CheckCircle2 size={8} /> {e.label}
                 </span>
                 <span>{e.timestamp}</span>
              </div>
            ))}
         </div>
      </div>
    </BrandCard>
  );
}
